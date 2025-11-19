<?php
include("db.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nome = $_POST["nome"];
  $email = $_POST["email"];
  $senha = password_hash($_POST["senha"], PASSWORD_DEFAULT);

  $sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sss", $nome, $email, $senha);

  if ($stmt->execute()) {
    echo "<script>alert('Cadastro realizado com sucesso! Faça login.'); window.location='login.php';</script>";
  } else {
    echo "<script>alert('Erro: e-mail já cadastrado!');</script>";
  }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Cadastro | Adventure Tour in Rio</title>
  <link rel="stylesheet" href="styles/front.css">
</head>
<body>
  <h2>Cadastro de Usuário</h2>
  <form method="POST" action="">
    <label>Nome:</label><br>
    <input type="text" name="nome" required><br>

    <label>E-mail:</label><br>
    <input type="email" name="email" required><br>

    <label>Senha:</label><br>
    <input type="password" name="senha" required><br>

    <button type="submit">Cadastrar</button>
  </form>

  <p>Já tem conta? <a href="login.php">Faça login</a></p>
</body>
</html>