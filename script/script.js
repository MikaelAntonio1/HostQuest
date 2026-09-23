const legalTexts = {
  termos: {
    title: 'Termos de Uso',
    content: `
      <p>Bem-vindo à <strong>HostQuest</strong>. Ao acessar e utilizar nossos serviços, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.</p>
      
      <h4>1. Aceitação dos Termos</h4>
      <p>Ao utilizar nossa plataforma e contratar nossos serviços de hospedagem e gestão, você declara ter lido e aceitado integralmente as diretrizes estabelecidas neste documento.</p>
      
      <h4>2. Prestação dos Serviços</h4>
      <p>A HostQuest oferece soluções tecnológicas e operacionais para anfitriões e imóveis de temporada. Empenhamo-nos em manter a disponibilidade contínua da plataforma, mas reservamo-nos o direito de realizar manutenções programadas.</p>
      
      <h4>3. Responsabilidade do Usuário</h4>
      <p>O usuário é responsável por manter a confidencialidade das credenciais da sua conta, bem como pela exatidão de todas as informações fornecidas sobre os imóveis cadastrados.</p>
      
      <h4>4. Alterações nos Termos</h4>
      <p>Reservamo-nos o direito de atualizar estes termos periodicamente. Alterações significativas serão notificadas aos usuários cadastrados através dos canais oficiais.</p>
    `
  },
  privacidade: {
    title: 'Política de Privacidade',
    content: `
      <p>A <strong>HostQuest</strong> respeita a sua privacidade e está comprometida em proteger os dados pessoais de todos os nossos clientes e visitantes.</p>
      
      <h4>1. Coleta de Informações</h4>
      <p>Coletamos dados fornecidos voluntariamente por você, como nome, e-mail, telefone e informações referentes aos imóveis cadastrados para prestação dos nossos serviços.</p>
      
      <h4>2. Uso dos Dados</h4>
      <p>Utilizamos suas informações para:</p>
      <ul>
        <li>Prestar e gerenciar os serviços contratados;</li>
        <li>Entrar em contato para suporte técnico ou atendimento;</li>
        <li>Enviar novidades, atualizações e informações operacionais.</li>
      </ul>
      
      <h4>3. Compartilhamento e Segurança</h4>
      <p>Seus dados pessoais não serão vendidos, alugados ou compartilhados com terceiros para fins mercadológicos. Adotamos medidas de segurança rígidas para proteger suas informações contra acesso não autorizado.</p>
      
      <h4>4. Seus Direitos</h4>
      <p>Você pode solicitar a qualquer momento a atualização, correção ou exclusão dos seus dados cadastrais através dos nossos canais formais de atendimento.</p>
    `
  }
};

function openLegalModal(type) {
  const modal = document.getElementById('legal-modal');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body-content');

  if (legalTexts[type]) {
    titleEl.textContent = legalTexts[type].title;
    bodyEl.innerHTML = legalTexts[type].content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLegalModal() {
  const modal = document.getElementById('legal-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('modal-close-btn');
  const okBtn = document.getElementById('modal-ok-btn');
  const modalOverlay = document.getElementById('legal-modal');

  if (closeBtn) closeBtn.addEventListener('click', closeLegalModal);
  if (okBtn) okBtn.addEventListener('click', closeLegalModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeLegalModal();
      }
    });
  }

  // Fechar ao apertar a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLegalModal();
    }
  });
});