import {$n, $t, $c, $a, on} from '../util.js'

function isolate(nodes, targetClass, op, lone) {
  nodes.forEach((node) => {
    op === "add" ? node.classList.add(targetClass) : node.classList.remove(targetClass);
  });
  op === "add" ? $t(lone).classList.remove(targetClass) : $t(lone).classList.add(targetClass)
}

export function navSetup() {
  const mainContent = $a("main-content");
  const navItems = $a("nav-item");
  
  navItems.forEach((nav) => {
    on(nav, "click", (e) => {
      isolate(mainContent,"hidden","add",e.currentTarget.dataset.section);
      isolate(navItems,"active","remove",e.currentTarget.id);
    })
  })
}