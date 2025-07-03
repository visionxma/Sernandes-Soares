document.getElementById('btn-simulacao').addEventListener('click', () => {
  document.getElementById('form-simulacao').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('form-simulacao').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = this.nome.value.trim();
  const whatsapp = this.whatsapp.value.trim();
  const tipo = this.tipo.value;
  alert(`Obrigado, ${nome}!\nSimulação para consórcio de ${tipo} enviada.\nEntraremos em contato via WhatsApp.`);
  this.reset();
});
