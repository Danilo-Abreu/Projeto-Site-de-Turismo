/* ========= SLIDER DE OFERTAS ========= */
let indice = 0;

function mostrarSlides() {
  const slides = document.querySelectorAll(".slide");
  if (slides.length === 0) return;

  slides.forEach(s => s.classList.remove("active"));
  indice = (indice + 1) % slides.length;
  slides[indice].classList.add("active");
}

setInterval(mostrarSlides, 4000);

/* ========= CARRINHO ========= */
let carrinho = [];

function toggleCarrinho() {
  document.getElementById("painel-carrinho").classList.toggle("ativo");
  document.getElementById("overlay").classList.toggle("ativo");
}

function adicionarAoCarrinho(nome, preco) {
  let item = carrinho.find(i => i.nome === nome);
  if (item) item.quantidade++;
  else carrinho.push({ nome, preco, quantidade: 1 });

  atualizarCarrinho();
  atualizarContador();
}

function removerDoCarrinho(nome) {
  carrinho = carrinho.filter(i => i.nome !== nome);
  atualizarCarrinho();
  atualizarContador();
}

function atualizarCarrinho() {
  const div = document.getElementById("carrinho-itens");
  div.innerHTML = "";

  let total = 0;

  carrinho.forEach(item => {
    total += item.preco * item.quantidade;

    div.innerHTML += `
      <div class="item-carrinho">
        <span>${item.nome} (x${item.quantidade})</span>
        <button onclick="removerDoCarrinho('${item.nome}')">X</button>
      </div>
    `;
  });

  document.getElementById("carrinho-total").innerText =
    "Total: R$ " + total.toFixed(2);
}

function atualizarContador() {
  document.getElementById("contador-carrinho").innerText =
    carrinho.reduce((acc, i) => acc + i.quantidade, 0);
}

document.getElementById("botao-comprar").onclick = () => {
  if (carrinho.length === 0) return alert("Carrinho vazio!");

  alert("Compra realizada com sucesso!");
  carrinho = [];
  atualizarCarrinho();
  atualizarContador();
};

document.getElementById("limpar-carrinho").onclick = () => {
  carrinho = [];
  atualizarCarrinho();
  atualizarContador();
};

/* ========= TABS ========= */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

/* ========= BUSCA ========= */
function buscarGlobal() {
    const termo = document.getElementById("busca-global").value.trim().toLowerCase();
    const resultados = document.getElementById("resultados-busca-global");
    const autocomplete = document.getElementById("autocomplete-list");
    resultados.innerHTML = "";
    autocomplete.innerHTML = "";
    autocomplete.style.display = "none";

    const categoriasSelecionadas = Array.from(document.querySelectorAll(".filtro-cat:checked"))
                                       .map(el => el.value);

    const cards = document.querySelectorAll(".card");
    let encontrados = 0;
    let sugestões = [];

    if (termo === "") {
        return;
    }
cards.forEach(card => {

        // Categoria do card (descoberta pela aba pai)
        const categoria = card.closest(".tab-content").id;

        // Se filtro ativo e categoria não bate → descartar
        if (categoriasSelecionadas.length > 0 &&
            !categoriasSelecionadas.includes(categoria)) return;

        const titulo = (card.querySelector("h4")?.innerText || "").toLowerCase();
        const preco = (card.querySelector(".preco")?.innerText || "").toLowerCase();
        const texto = card.innerText.toLowerCase();
        const alt = (card.querySelector("img")?.alt || "").toLowerCase();

        const combinado = `${titulo} ${preco} ${texto} ${alt}`;

        // AUTOCOMPLETE (sugestões)
        if (titulo.includes(termo)) {
            sugestões.push(titulo);
        }

        if (combinado.includes(termo)) {
            encontrados++;

            const clone = card.cloneNode(true);

            // Destaque da palavra
            function destacar(texto) {
                const index = texto.toLowerCase().indexOf(termo);
                if (index === -1) return texto;

                return texto.substring(0, index) +
                       `<span class="marcado">${texto.substring(index, index + termo.length)}</span>` +
                       texto.substring(index + termo.length);
            }

            // Destacar título
            const h4 = clone.querySelector("h4");
            if (h4) h4.innerHTML = destacar(h4.innerText);

            // Tornar o resultado clicável → abre o card original
            clone.style.cursor = "pointer";
            clone.onclick = () => {
                document.querySelector(`button[data-tab="${categoria}"]`).click();
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                card.style.outline = "3px solid yellow";
                setTimeout(() => card.style.outline = "none", 1200);
            };

            resultados.appendChild(clone);
        }
    });

    // Se nenhum resultado
    if (encontrados === 0) {
        resultados.innerHTML = `<p><b>Nenhum passeio encontrado para "${termo}".</b></p>`;
    }

    // Mostrar autocomplete
    if (sugestões.length > 0) {
        autocomplete.style.display = "block";
        sugestões.slice(0, 10).forEach(sug => {
            let li = document.createElement("li");
            li.innerText = sug;
            li.onclick = () => {
                document.getElementById("busca-global").value = sug;
                buscarGlobal();
                autocomplete.style.display = "none";
            };
            autocomplete.appendChild(li);
        });
    }
}

/* ========= CLIQUE NO SLIDE ========= */
function abrirOferta(id) {
  const ofertas = [
    {
      img: "./imagens/joatinga.2.jpg",
      titulo: "Rapel na Joatinga",
      preco: 140,
      descricao: "Oferta especial válida até domingo!"
    },
    {
      img: "./imagens/asa3.jpg",
      titulo: "Voo de Asa Delta",
      preco: 450,
      descricao: "Desconto especial imperdível!"
    },
    {
      img: "./imagens/PedraGavea.jpg",
      titulo: "Trilha Pedra Gávea",
      preco: 100,
      descricao: "Desconto especial imperdível!"
    },
    {
      img: "./imagens/cachoeiras-de-guapimirim-5.jpg",
      titulo: "Cachoeira Secreta",
      preco: 90,
      descricao: "Pacote promocional limitado!"
    }
  ];

  let o = ofertas[id];

  abrirModalPasseio(o.img, o.titulo, o.preco, o.descricao);
}

/* ========= MODAL UNIVERSAL ========= */
function abrirModalPasseio(img, titulo, preco, descricao) {
  document.getElementById("modal-img").src = img;
  document.getElementById("modal-titulo").innerText = titulo;
  document.getElementById("modal-descricao").innerText = descricao;
  document.getElementById("modal-preco").innerText = "Preço: R$ " + preco;

  document.getElementById("modal-btn-carrinho").onclick = () =>
    adicionarAoCarrinho(titulo, preco);

  document.getElementById("modalPasseio").style.display = "flex";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

/* ========= GALERIA ========= */
let galeriaImagens = [];
let galeriaIndex = 0;

function abrirGaleria(imagens) {
  galeriaImagens = imagens;
  galeriaIndex = 0;

  document.getElementById("galeria-img").src = galeriaImagens[galeriaIndex];
  document.getElementById("galeria-modal").style.display = "flex";
  
}

function fecharGaleria() {
  document.getElementById("galeria-modal").style.display = "none";
}


function galeriaProxima() {
  galeriaIndex = (galeriaIndex + 1) % galeriaImagens.length;
  document.getElementById("galeria-img").src = galeriaImagens[galeriaIndex];
}

function galeriaAnterior() {
  galeriaIndex = (galeriaIndex - 1 + galeriaImagens.length) % galeriaImagens.length;
  document.getElementById("galeria-img").src = galeriaImagens[galeriaIndex];
}
window.addEventListener("click", function(event) {
  const modal = document.getElementById("galeria-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


/* ========= BOTÕES FIXOS ========= */
document.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTop.style.display = "flex";
    whatsappButton.style.display = "flex";
  } else {
    backToTop.style.display = "none";
    whatsappButton.style.display = "none";
  }
});

backToTop.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

whatsappButton.onclick = () => {
  window.open("https://wa.me/5521990665379", "_blank");
};
window.addEventListener("click", function(event) {
  const modal = document.getElementById("modalPasseio");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
function abrirDetalhes(passeio) {
  document.getElementById("detalhe-img").src = passeio.img;
  document.getElementById("detalhe-titulo").innerText = passeio.titulo;
  document.getElementById("detalhe-descricao").innerText = passeio.descricao;
  document.getElementById("detalhe-duracao").innerText = passeio.duracao;
  document.getElementById("detalhe-dificuldade").innerText = passeio.dificuldade;
  document.getElementById("detalhe-preco").innerText = "R$ " + passeio.preco;

  document.getElementById("detalhe-galeria").onclick = () =>
    abrirGaleria(passeio.galeria);

  document.getElementById("detalhe-carrinho").onclick = () =>
    adicionarAoCarrinho(passeio.titulo, passeio.preco);

  document.getElementById("modalDetalhes").style.display = "flex";
}

function fecharModalDetalhes() {
  document.getElementById("modalDetalhes").style.display = "none";
}