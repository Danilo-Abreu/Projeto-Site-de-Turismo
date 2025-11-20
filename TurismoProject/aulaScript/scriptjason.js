function obterImagensAleatoriasAuau() {
    const auAu = document.getElementById("resultado-canis");
    const xhr = new XMLHttpRequest();
    const endpoint = "https://dog.ceo/api/breeds/image/random";

    xhr.open("GET", endpoint, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const dados = JSON.parse(xhr.responseText);
            const imageUrl = dados.message;
            auAu.innerHTML = `<img src="${imageUrl}" alt="Cachorro olhando diretamente para a câmera, possivelmente sentado, em ambiente externo com grama e plantas ao fundo; expressão curiosa e amistosa; sem texto visível" width="300" height="300">`;
        } else {
            auAu.innerHTML = "Não foi possível obter a imagem de cachorro.";
        }
    };

    xhr.send();
}
