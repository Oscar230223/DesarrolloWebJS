let data = [
    { name: "Inicio", url: "/" },
    { name: "Becas", url: "/Becas" },
    { name: "Carreras", url: "/Carreras" },
    { name: "Examen de Admision", url: "/ExamenAdmision" },
    { name: "Sobre Nosotros", url: "/SobreNosotros" },
    { name: "Registro", url: "/registro"},
    { name: "Inicio de Sesion", url: "/login"},
    { name: "Quejas", url: "/BuzonQuejas"},
    { name: "Chat", url: "/Chat"},
    { name: "Recuperar Contraseña", url: "/Recuperar_Contraseña"},
    { name: "Perfil", url: "/Perfil"}
];

function buscar() {
    let query = document.getElementById("buscar").value;

    if (query.trim() === "") {
        document.getElementById("results").style.display = "none";
        return;
    }

    let results = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

    let resultsElement = document.getElementById("results");
    resultsElement.innerHTML = "";

    if (results.length > 0) {
        results.forEach(result => {
            let li = document.createElement("li");
            li.textContent = result.name;
            li.addEventListener("click", () => {
                window.location.href = result.url;
            });
            resultsElement.appendChild(li);
        });
    } else {
        let li = document.createElement("li");
        li.textContent = "No se encontraron elementos para: " + query;
        resultsElement.appendChild(li);
    }

    resultsElement.style.display = "block";
}

document.getElementById("buscar").addEventListener("input", buscar);

document.addEventListener("click", function(event) {
    if (!document.querySelector('.buscar-wrapper').contains(event.target)) {
        document.getElementById("results").style.display = "none";
    }
});
