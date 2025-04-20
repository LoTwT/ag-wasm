use crate::wasm_lang::{WasmDoc, WasmLang};
use ast_grep_config::{Fixer, RuleConfig};
use ast_grep_core::{
  meta_var::{MetaVarEnv, MetaVariable},
  replacer::Replacer,
  Node as SgNode, NodeMatch as SgNodeMatch,
};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[cfg(feature = "console_error_panic_hook")]
pub fn set_panic_hook() {
  // When the `console_error_panic_hook` feature is enabled, we can call the
  // `set_panic_hook` function at least once during initialization, and then
  // we will get better error messages if our code ever panics.
  //
  // For more details see
  // https://github.com/rustwasm/console_error_panic_hook#readme
  console_error_panic_hook::set_once();
}

type Node<'a> = SgNode<'a, WasmDoc>;
type NodeMatch<'a> = SgNodeMatch<'a, WasmDoc>;

#[derive(Serialize, Deserialize)]
pub struct WasmNode {
  pub text: String,
  pub range: (usize, usize, usize, usize),
}

#[derive(Serialize, Deserialize)]
pub struct WasmMatch {
  pub id: usize,
  pub node: WasmNode,
  pub env: BTreeMap<String, WasmNode>,
  pub message: String,
}

// TODO: move to ast-grep-core
fn get_message(rule: &RuleConfig<WasmLang>, node: &NodeMatch) -> String {
  let parsed = Fixer::from_str(&rule.message, &rule.language).expect("should work");
  let bytes = parsed.generate_replacement(node);
  bytes.into_iter().collect()
}

impl WasmMatch {
  pub fn from_match(nm: NodeMatch, rule: &RuleConfig<WasmLang>) -> Self {
    let node = nm.get_node().clone();
    let id = node.node_id();
    let node = WasmNode::from(node);
    let env = nm.get_env().clone();
    let env = env_to_map(env);
    let message = get_message(rule, &nm);
    Self {
      node,
      env,
      message,
      id,
    }
  }
}

fn env_to_map(env: MetaVarEnv<'_, WasmDoc>) -> BTreeMap<String, WasmNode> {
  let mut map = BTreeMap::new();
  for id in env.get_matched_variables() {
    match id {
      MetaVariable::Capture(name, _) => {
        if let Some(node) = env.get_match(&name) {
          map.insert(name, WasmNode::from(node.clone()));
        } else if let Some(bytes) = env.get_transformed(&name) {
          let node = WasmNode {
            text: bytes.iter().collect(),
            range: (0, 0, 0, 0),
          };
          map.insert(name, WasmNode::from(node));
        }
      }
      MetaVariable::MultiCapture(name) => {
        let nodes = env.get_multiple_matches(&name);
        let (Some(first), Some(last)) = (nodes.first(), nodes.last()) else {
          continue;
        };
        let start = first.start_pos();
        let end = last.end_pos();

        let text = nodes.iter().map(|n| n.text()).collect();
        let node = WasmNode {
          text,
          range: (
            start.line(),
            start.column(first),
            end.line(),
            end.column(last),
          ),
        };
        map.insert(name, node);
      }
      // ignore anonymous
      _ => continue,
    }
  }
  map
}

impl From<Node<'_>> for WasmNode {
  fn from(nm: Node) -> Self {
    let start = nm.start_pos();
    let end = nm.end_pos();
    Self {
      text: nm.text().to_string(),
      range: (start.line(), start.column(&nm), end.line(), end.column(&nm)),
    }
  }
}
