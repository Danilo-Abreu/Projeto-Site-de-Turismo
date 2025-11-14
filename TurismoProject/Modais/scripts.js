let indice = 0;
function mostrarSlides() { 
  const slides = document.querySelectorAll(".slide"); 
  if (slides.length === 0) return;
  slides.forEach(slide => slide.classList.remove("active")); 
  indice = (indice + 1) % slides.length; 
  slides[indice].classList.add("active"); 
}
setInterval(mostrarSlides, 4000); 
// muda a cada 4 segundos
// ======== CARRINHO DE COMPRAS ======== //
let carrinho = [];

// Abrir/Fechar carrinho
function toggleCarrinho() {
  document.getElementById("painel-carrinho").classList.toggle("ativo");
  document.getElementById("overlay").classList.toggle("ativo");
}

// Adicionar item ao carrinho
function adicionarAoCarrinho(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  atualizarCarrinho();
  atualizarContador();
}

// Remover item específico
function removerDoCarrinho(nome) {
  const index = carrinho.findIndex(item => item.nome === nome);
  if (index !== -1) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    atualizarContador();
  }
}

// Atualiza a lista do carrinho
function atualizarCarrinho() {
  const container = document.getElementById("carrinho-itens");
  const totalElement = document.getElementById("carrinho-total");

  container.innerHTML = "";
  let total = 0;

  carrinho.forEach(item => {
    const precoItem = item.preco * item.quantidade;
    total += precoItem;

    const itemHTML = document.createElement("div");
    itemHTML.classList.add("item-carrinho");

    itemHTML.innerHTML = `
      <span>${item.nome} (x${item.quantidade}) - R$ ${precoItem.toFixed(2)}</span>
      <button class="remover-item" onclick="removerDoCarrinho('${item.nome}')">X</button>
    `;

    container.appendChild(itemHTML);
  });

  totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Atualiza o número no ícone do carrinho
function atualizarContador() {
  const contador = document.getElementById("contador-carrinho");
  let totalItens = 0;
  carrinho.forEach(item => totalItens += item.quantidade);
  contador.textContent = totalItens;
}
document.getElementById("botao-comprar").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
});

    // Exemplo de ação inicial
    alert("Compra finalizada! Em breve você receberá os detalhes no WhatsApp.");
    carrinho = [];
    atualizarCarrinho();

// Esvaziar carrinho
document.getElementById("limpar-carrinho").addEventListener("click", () => {
  carrinho = [];
  atualizarCarrinho();
  atualizarContador();
});
// ======== TROCA DE ABAS (TABS) ======== //
document.addEventListener("DOMContentLoaded", () => { 
  const tabs = document.querySelectorAll(".tab"); 
  const contents = document.querySelectorAll(".tab-content"); 
  tabs.forEach(tab => { 
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active")); 
      contents.forEach(c => c.classList.remove("active")); 
      tab.classList.add("active"); 
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add("active"); 
    }); 
  }); 
}); 

// ======== MODAIS ======== 
function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

function fecharModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// Fecha modal clicando fora do conteúdo
window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = "none";
  }
};

// ========= CARROSSEL AUTOMÁTICO E UNIVERSAL =========

// Configurações gerais
const tempoTroca = 4000; // tempo entre slides (4 segundos)
let carrosseis = []; // lista para guardar todos os carrosseis

// Função para iniciar todos os carrosseis da página
document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".carrossel-container");

  containers.forEach((container, index) => {
    const trilhas = container.querySelector(".trilhas");
    const itens = container.querySelectorAll(".item");
    const dotsContainer = container.querySelector(".dots");

    if (!trilhas || itens.length === 0) return;

    // Cria os dados de controle do carrossel
    const carrossel = {
      container,
      trilhas,
      itens,
      dotsContainer,
      posicao: 0,
      intervalo: null,
    };

    // Cria os pontinhos
    criarDots(carrossel);

    // Inicia movimento automático
    iniciarCarrosselAuto(carrossel);

    // Eventos de pausa e retomada
    trilhas.addEventListener("mouseenter", () => pararCarrosselAuto(carrossel));
    trilhas.addEventListener("mouseleave", () => iniciarCarrosselAuto(carrossel));

    // Guarda o carrossel
    carrosseis.push(carrossel);
  });
});

// ======= Funções =======

// Cria os pontinhos
function criarDots(carrossel) {
  carrossel.dotsContainer.innerHTML = "";

  carrossel.itens.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");

    dot.onclick = () => {
      carrossel.posicao = i;
      moverCarrossel(carrossel, 0);
      atualizarDots(carrossel);
    };

    carrossel.dotsContainer.appendChild(dot);
  });
}

// Move o carrossel na direção (+1 ou -1)
function moverCarrossel(carrossel, direcao = 1) {
  const { trilhas, itens } = carrossel;
  const larguraItem = itens[0].offsetWidth + 20;
  const totalItens = itens.length;
  const visiveis = Math.max(1, Math.floor(trilhas.offsetWidth / larguraItem));

  carrossel.posicao += direcao;
  if (carrossel.posicao < 0) carrossel.posicao = totalItens - visiveis;
  if (carrossel.posicao > totalItens - visiveis) carrossel.posicao = 0;

  trilhas.style.transform = `translateX(-${carrossel.posicao * larguraItem}px)`;
  atualizarDots(carrossel);
}

// Atualiza os pontinhos
function atualizarDots(carrossel) {
  const dots = carrossel.dotsContainer.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === carrossel.posicao);
  });
}

// Carrossel automático
function iniciarCarrosselAuto(carrossel) {
  pararCarrosselAuto(carrossel); // evita duplicação
  carrossel.intervalo = setInterval(() => moverCarrossel(carrossel, 1), tempoTroca);
}

// Pausa automática
function pararCarrosselAuto(carrossel) {
  if (carrossel.intervalo) clearInterval(carrossel.intervalo);
}

// ======= Setas opcionais (caso tenha botões de seta no HTML) =======
function moverCarrosselPorId(seta, direcao) {
  const carrossel = carrosseis.find(c => c.trilhas.id === seta.dataset.trilhasId);
  if (carrossel) moverCarrossel(carrossel, direcao);
}
document.addEventListener('DOMContentLoaded', function () { // Espera o HTML carregar para só então rodar o script

    // Ajusta para garantir que o site comece no topo ao recarregar
    if (window.location.hash !== '#inicio') {               // Verifica se a URL não tem o hash #inicio
        window.location.hash = '#inicio';                   // Se não tiver, adiciona #inicio para "forçar" início no topo
    }

    const backToTopButton = document.getElementById('backToTop');   // Pega o botão "Voltar ao topo" pelo ID
    const whatsappButton = document.getElementById('whatsappButton'); // Pega o botão do WhatsApp pelo ID

    // Função para exibir ou esconder os botões ao rolar a página
    function toggleButtons() {                             // Define a função que controla a visibilidade dos botões
        const scrollPosition = window.scrollY;             // Pega a quantidade de rolagem vertical da página
        if (scrollPosition > 100) {                        // Se rolou mais de 100px...
            backToTopButton.style.display = 'flex';        // Mostra o botão "Voltar ao topo" (display flex)
            whatsappButton.style.display = 'flex';         // Mostra o botão do WhatsApp (display flex)
            setTimeout(() => {                             // Pequeno atraso para permitir transição de opacidade
                backToTopButton.style.opacity = '1';       // Faz o botão de topo aparecer (fade in)
                whatsappButton.style.opacity = '1';        // Faz o botão do WhatsApp aparecer (fade in)
            }, 10);
        } else {                                           // Se estiver no topo (ou perto)
            backToTopButton.style.opacity = '0';           // Começa a esconder o botão de topo (fade out)
            whatsappButton.style.opacity = '0';            // Começa a esconder o botão do WhatsApp (fade out)
            setTimeout(() => {                             // Aguarda a transição de opacidade terminar
                backToTopButton.style.display = 'none';    // Some com o botão de topo da tela
                whatsappButton.style.display = 'none';     // Some com o botão do WhatsApp da tela
            }, 500);                                       // Tempo deve combinar com a duração de transition no CSS
        }
    }

    // Adiciona o evento de scroll para exibir ou esconder os botões
    document.addEventListener('scroll', toggleButtons);    // Executa toggleButtons sempre que a página rolar

    // Ação ao clicar no botão "Voltar ao Topo"
    backToTopButton.addEventListener('click', function () {  // Quando clicar no botão de topo...
        window.scrollTo({ top: 0, behavior: 'smooth' });     // Rola suavemente até o topo da página
    });

    // Ação ao clicar no botão do WhatsApp
    whatsappButton.addEventListener('click', function () {   // Quando clicar no botão do WhatsApp...
        window.open('https://wa.me/5521990665379', '_blank') ;// Abre o chat do WhatsApp com esse número
    });
}); // Fim do DOMContentLoaded: garante que tudo só roda depois do HTML estar pronto