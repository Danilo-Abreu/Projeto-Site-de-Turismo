<?php
session_start();
include("db.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = $_POST["email"];
  $senha = $_POST["senha"];

  $sql = "SELECT * FROM usuarios WHERE email = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $resultado = $stmt->get_result();

  if ($resultado->num_rows > 0) {
    $usuario = $resultado->fetch_assoc();
    if (password_verify($senha, $usuario["senha"])) {
      $_SESSION["usuario"] = $usuario["nome"];
      header("Location: index.html");
      exit;
    } else {
      echo "<script>alert('Senha incorreta!');</script>";
    }
  } else {
    echo "<script>alert('Usuário não encontrado!');</script>";
  }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Login | Adventure Tour in Rio</title>
  <link rel="stylesheet" href="styles/front.css">
</head>
<body>
  <h2>Login</h2>
  <form method="POST" action="">
    <label>E-mail:</label><br>
    <input type="email" name="email" required><br>

    <label>Senha:</label><br>
    <input type="password" name="senha" required><br>

    <button type="submit">Entrar</button>
  </form>

  <p>Não tem conta? <a href="cadastro.php">Cadastre-se</a></p>
</body>
</html>