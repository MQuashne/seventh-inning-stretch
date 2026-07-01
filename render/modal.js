/**

 * Modal.js

 * Generic reusable modal for a single-page application.

 */

import { $n, $t, $c, on } from '../util.js'

export default class Modal {
  constructor() {
    this.isOpen = false;
    this.onClose = null;
    this.build();
    this.bindEvents();
    this.backdrop.classList.add('hidden');
  }
  
  //Public functions
  
  show(options = {}) {
    this.clear()
    
    this.options = {
      title: "",
      subtitle: "",
      icon: null,
      body: null,
      footer: null,
      buttons: [],
      size: "medium",
      closeOnBackdrop: true,
      closeOnEscape: true,
      onOpen: null,
      onClose: null,
      ...options
    };
    this.onClose = this.options.onClose;
    this.setSize(this.options.size);
    this.renderHeader();
    this.renderBody();
    this.renderButtons();
    this.renderFooter();
    this.backdrop.classList.remove("hidden");
    this.dialog.classList.remove("hidden");
    this.dialog.focus();
    this.options.onOpen && this.options.onOpen();
    this.isOpen=true;
  }
  
  close(result = null) {
    if (!this.isOpen) {
      return
    }
    this.backdrop.classList.add("hidden");
    this.dialog.classList.add("hidden");
    this.isOpen = false;
    this.options.onClose && this.options.onClose();
  }
  
  destroy() {
    this.backdrop.remove();
  }
  
  //Construction
  
  build() {
    this.backdrop = $n("div", "modal-backdrop");
    
    this.dialog = $n("div", "dialog");
    
    this.header = $n("div", "modal-header");
    
    this.body = $n("div", "modal-body");
    
    this.actions = $n("div", "modal-actions");
    
    this.footer = $n("div", "modal-footer");
    
    this.dialog.append(
      this.header,
      this.body,
      this.actions,
      this.footer
    );
    
    this.backdrop.append(this.dialog);
    
    document.body.append(this.backdrop);
  }
  
  bindEvents() {
    this.backdrop.addEventListener("click", e => {
      
      if (!this.options.closeOnBackdrop)
        return;
      
      if (e.target === this.backdrop)
        this.close();
      
    });
  }
  
  //Rendering
  
  clear() {
    this.header.replaceChildren();
    this.body.replaceChildren();
    this.footer.replaceChildren();
    this.actions.replaceChildren();
  }
  
  renderHeader() {
    if (this.options.icon)
      this.header.append(this.options.icon);
    
    const title = $n("div", "modal-title");
    title.textContent = this.options.title;
    
    this.header.append(title);
    
    if (this.options.subtitle) {
      
      const subtitle = $n("div", "modal-subtitle");
      subtitle.textContent = this.options.subtitle;
      
      this.header.append(subtitle);
      
    }
    
    const closeButton = $n("button", "modal-close");
    closeButton.innerHTML = "&times;";
    
    closeButton.addEventListener("click", () => this.close());
    
    this.header.append(closeButton);
    
  }
  
  renderBody() {
    if (!this.options.body)
      return;
    
    if (this.options.body instanceof Node)
      this.body.append(this.options.body);
    else
      this.body.textContent = String(this.options.body);
    
  }
  
  renderButtons() {
    this.options.buttons.forEach(button => {
      
      const b = $n("button", button.type);
      
      b.textContent = button.text ?? "Button";
      
      b.addEventListener("click", () => {
        
        if (button.action)
          button.action(this);
        
        if (button.close !== false)
          this.close();
      });
      
      this.actions.append(b);
    })
  }
  
  renderFooter() {
    if (!this.options.footer)
      return;
    
    if (this.options.footer instanceof Node)
      this.footer.append(this.options.footer);
    else
      this.footer.textContent = String(this.options.footer);
  }
  
  setSize(size) {
    this.dialog.classList.remove(
  
  "small",
  
  "medium",
  
  "large",
  
  "fullscreen"
  
);

this.dialog.classList.add(size);
  }
}