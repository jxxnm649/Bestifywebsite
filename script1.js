const form = document.getElementById("registerForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    alert(
        "Name: " + name +
        "\nEmail: " + email +
        "\nPassword: " + password
    );
});