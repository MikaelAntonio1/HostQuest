/* HostQuest — interações do site */
(function () {
  'use strict';

  var WHATSAPP = '5581996473467';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menu hambúrguer ---------- */
  var burger = document.getElementById('hq-burger');
  var menu = document.getElementById('hq-menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (burger && menu) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!menu.classList.contains('open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Elementos aparecendo ao rolar ---------- */
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('hq-js');
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || en.boundingClientRect.top < 0) {
          en.target.classList.add('hq-in');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.hq-reveal').forEach(function (el) { revealIO.observe(el); });
    // garantia: nada fica invisível se a animação não disparar
    setTimeout(function () {
      document.querySelectorAll('.hq-reveal:not(.hq-in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('hq-in');
      });
    }, 1500);

    /* pausa as animações em loop das seções fora da tela (economiza bateria/CPU) */
    var pauseIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('hq-paused', !en.isIntersecting); });
    }, { rootMargin: '150px 0px' });
    document.querySelectorAll('.hq-anim').forEach(function (el) { pauseIO.observe(el); });
  }

  /* ---------- Efeitos que seguem o mouse ---------- */
  var pending = new Map();
  var raf = 0;
  function flush() {
    raf = 0;
    pending.forEach(function (p, node) {
      var r = node.getBoundingClientRect();
      var x = p[0] - r.left, y = p[1] - r.top;
      node.style.setProperty('--mx', x.toFixed(0) + 'px');
      node.style.setProperty('--my', y.toFixed(0) + 'px');
      if (node.hasAttribute('data-mag')) {
        node.style.setProperty('--bx', ((x - r.width / 2) * 0.18).toFixed(1) + 'px');
        node.style.setProperty('--by', ((y - r.height / 2) * 0.3).toFixed(1) + 'px');
      }
    });
    pending.clear();
  }
  if (!reduceMotion) {
    document.querySelectorAll('[data-track]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        pending.set(el, [e.clientX, e.clientY]);
        if (!raf) raf = requestAnimationFrame(flush);
      });
      el.addEventListener('mouseleave', function () {
        pending.delete(el);
        el.style.setProperty('--bx', '0px');
        el.style.setProperty('--by', '0px');
      });
    });
  }

  /* ---------- Como funciona (etapas) ---------- */
  var STEPS = [
    { c: '#FF5A5A', title: 'Conversa inicial', text: 'Uma conversa rápida para entender seus objetivos, seu público e o que o site precisa entregar. Sem jargão técnico.', items: ['Objetivos e público-alvo', 'Referências que você gosta', 'Conteúdo e funcionalidades'] },
    { c: '#A57FDB', title: 'Proposta', text: 'Você recebe uma proposta clara com tudo o que será feito, quanto custa e quando fica pronto. Só começamos com seu ok.', items: ['Escopo detalhado', 'Cronograma definido', 'Investimento sem surpresas'] },
    { c: '#00B2E8', title: 'Design & desenvolvimento', text: 'Criamos o visual a partir da sua marca e desenvolvemos o site. Você acompanha e pede ajustes ao longo do caminho.', items: ['Layout exclusivo para aprovação', 'Desenvolvimento responsivo', 'Rodadas de ajustes inclusas'] },
    { c: '#6E86DE', title: 'Entrega & suporte', text: 'Publicamos o site com domínio e hospedagem configurados, e seguimos por perto para o que você precisar.', items: ['Publicação com SSL', 'Orientação para usar o site', 'Suporte após a entrega'] }
  ];
  var stepBtns = document.querySelectorAll('.hq-step');
  var bars = document.querySelectorAll('.hq-bar');
  var badge = document.getElementById('hq-step-badge');
  var stepN = document.getElementById('hq-step-n');
  var stepTitle = document.getElementById('hq-step-title');
  var stepText = document.getElementById('hq-step-text');
  var stepItems = document.querySelectorAll('#hq-step-items li span');
  function swap(el) { el.classList.remove('hq-swap'); void el.offsetWidth; el.classList.add('hq-swap'); }
  function showStep(i) {
    var s = STEPS[i];
    stepBtns.forEach(function (b, j) {
      b.classList.toggle('active', j === i);
      b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
    });
    bars.forEach(function (bar, j) { bar.style.background = j <= i ? s.c : ''; });
    badge.style.background = s.c;
    badge.textContent = stepN.textContent = '0' + (i + 1);
    stepTitle.textContent = s.title;
    stepText.textContent = s.text;
    stepItems.forEach(function (sp, j) { sp.textContent = s.items[j]; });
    [stepTitle, stepText, document.getElementById('hq-step-items')].forEach(swap);
  }
  stepBtns.forEach(function (b) {
    b.addEventListener('click', function () { showStep(+b.getAttribute('data-step')); });
  });

  /* ---------- Dúvidas (FAQ) ---------- */
  var faqs = document.querySelectorAll('.hq-faq');
  faqs.forEach(function (item) {
    var btn = item.querySelector('button');
    var ans = item.querySelector('.hq-faq-a');
    btn.addEventListener('click', function () {
      var willOpen = !item.classList.contains('open');
      faqs.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('button').setAttribute('aria-expanded', 'false');
        other.querySelector('.hq-faq-a').hidden = true;
      });
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        ans.hidden = false;
      }
    });
  });

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.getElementById('hq-form');
  var nameInput = document.getElementById('hq-nome');
  var msgInput = document.getElementById('hq-msg');
  var waBtn = document.getElementById('hq-wa');
  var chips = document.querySelectorAll('.hq-chip');
  var service = chips.length ? chips[0].textContent : '';
  function waLink() {
    var lines = ['Olá, HostQuest!' + (nameInput.value.trim() ? ' Meu nome é ' + nameInput.value.trim() + '.' : ''),
                 'Tenho interesse em: ' + service + '.'];
    if (msgInput.value.trim()) lines.push(msgInput.value.trim());
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
  }
  function updateWa() { if (waBtn) waBtn.href = waLink(); }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      service = chip.textContent;
      updateWa();
    });
  });
  if (nameInput) nameInput.addEventListener('input', updateWa);
  if (msgInput) msgInput.addEventListener('input', updateWa);
  if (waBtn) waBtn.addEventListener('click', function () {
    updateWa();
    if (typeof gtag === 'function') gtag('event', 'clique_orcamento', { servico: service });
  });
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.open(waLink(), '_blank', 'noopener');
  });
  updateWa();

  /* ---------- Cliques que valem medir no Google Analytics (ex.: "Ver site no ar" dos projetos) ---------- */
  document.querySelectorAll('[data-evento]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof gtag === 'function') gtag('event', el.getAttribute('data-evento'), { projeto: el.getAttribute('data-projeto') || '' });
    });
  });

  /* ---------- Termos de uso e Privacidade ---------- */
  var LEGAL = {
    termos: {
      title: 'Termos de uso',
      html: '<p>Estes termos se aplicam ao uso do site da <strong>HostQuest</strong> e à contratação dos nossos serviços de criação de sites, landing pages, automações, hospedagem e manutenção.</p>' +
        '<h3>1. Orçamentos e propostas</h3><p>Os valores, prazos e o escopo de cada projeto são definidos em uma proposta enviada ao cliente. O trabalho começa somente após a aprovação dessa proposta.</p>' +
        '<h3>2. Conteúdo do cliente</h3><p>O cliente é responsável pelos textos, imagens e marcas que fornecer para o projeto e garante ter o direito de usá-los.</p>' +
        '<h3>3. Hospedagem e manutenção</h3><p>Quando contratados, a hospedagem e a manutenção seguem as condições descritas na proposta. Podem ocorrer interrupções breves para atualizações e manutenção programada.</p>' +
        '<h3>4. Alterações</h3><p>Estes termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta página.</p>'
    },
    privacidade: {
      title: 'Política de privacidade',
      html: '<p>A <strong>HostQuest</strong> respeita a sua privacidade e trata dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).</p>' +
        '<h3>1. Quais dados coletamos</h3><p>Coletamos apenas os dados que você nos envia ao entrar em contato, como nome, telefone, e-mail e informações sobre o seu projeto. O formulário deste site não armazena nada: ele apenas abre uma conversa no WhatsApp com a mensagem pronta.</p>' +
        '<h3>2. Estatísticas de acesso</h3><p>Usamos o Google Analytics para entender, de forma agregada, como o site é visitado (por exemplo, quantas pessoas acessaram e de quais páginas vieram). Essas informações não identificam você pessoalmente.</p>' +
        '<h3>3. Como usamos os dados</h3><p>Usamos seus dados somente para responder ao seu contato, elaborar propostas e prestar os serviços contratados. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.</p>' +
        '<h3>4. Seus direitos</h3><p>Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados pelo e-mail contato.hostquest@gmail.com.</p>'
    }
  };
  var dlg = document.getElementById('hq-legal');
  if (dlg && typeof dlg.showModal === 'function') {
    document.querySelectorAll('[data-legal]').forEach(function (b) {
      b.addEventListener('click', function () {
        var doc = LEGAL[b.getAttribute('data-legal')];
        document.getElementById('hq-legal-title').textContent = doc.title;
        document.getElementById('hq-legal-body').innerHTML = doc.html;
        dlg.showModal();
      });
    });
    dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }
})();
