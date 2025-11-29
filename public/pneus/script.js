const pneus = {
	r14: [
		{
			medida: "175/70",
			contrato: "078/2023/SESP",
			fornecedora: "CRISTIANO RODRIGUES",
			lugar: "ALMOXARIFADO/ACADEPOL",
		},
	],
	r15: [
		{
			medida: "195/65",
			contrato: "079/2023/SESP",
			fornecedora: "PNEU AR",
			lugar: "POLINTER",
		},
	],
	r16: [
		{
			medida: "205/60",
			contrato: "330/2022/SESP",
			fornecedora: "MULTIQUALITY",
			lugar: "POLINTER",
		},
		{
			medida: "215/65",
			contrato: "080/2023/SESP",
			fornecedora: "MULTIQUALITY",
			lugar: "ALMOXARIFADO/ACADEPOL",
		},
	],
	"r17,5": [
		{
			medida: "215/70",
			contrato: "078/2023/SESP",
			fornecedora: "CRISTIANO RODRIGUES",
			lugar: "ALMOXARIFADO/ACADEPOL",
		},
	],
	"r22,5": [
		{
			medida: "275/80",
			contrato: "330/2022/SESP",
			fornecedora: "MULTIQUALITY",
			lugar: "ALMOXARIFADO/ACADEPOL",
		},
	],
};

const formatarDoc = document.querySelector(".formatar-doc");
const colDesc = document.querySelector("#col-desc");
const colContrato = document.querySelector("#col-contrato");
const colFornecedora = document.querySelector("#col-fornecedora");
const nomeMotoristaField = document.querySelector("#nomeMotoristaField");
const matriculaField = document.querySelector("#matriculaField");
const placaField = document.querySelector("#placaField");
const modeloField = document.querySelector("#modeloField");
const qtdPneusField = document.querySelector("#qtdPneusField");
const unidadeField = document.querySelector("#unidadeField");
const dataRetiradaField = document.querySelector("#dataRetiradaField");
const endereco = document.querySelector(".endereco-value");

let aroValue;

// Função que será executada ao clicar no botão
function gerarPDF() {
	const elemento = document.getElementById("documento");

	// Configura o html2canvas para alta fidelidade
	html2canvas(elemento, {
		scale: 3, // Alta resolução (melhor para textos e linhas)
		logging: false,
		useCORS: true,
		allowTaint: true,
	}).then((canvas) => {
		const pdfWidth = 210;
		const pdfHeight = 297;
		const imgData = canvas.toDataURL("image/jpeg", 1.0);

		const { jsPDF } = window.jspdf;
		const pdf = new jsPDF("p", "mm", "a4");

		// Adiciona a imagem no PDF, preenchendo a página A4
		pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

		const fileName = document.querySelector(".header-title").textContent;
		pdf.save(`${fileName}.pdf`);
	});
}

document.addEventListener("input", (e) => {
	const element = e.target;

	if (element.name === "aro") {
		aroValue = element.value;
		document.querySelector("select[name='medida']")?.remove();
		const html = `
        <select name="medida" id="medida">
                ${pneus[`${element.value}`]?.map((pneu) => `<option value="${pneu.medida}">${pneu.medida} - ${pneu.lugar}</option>`)}
        </select>
        `;

		formatarDoc.insertAdjacentHTML("beforeend", html);

		colDesc.textContent = `${pneus[`${element.value}`][0].medida} ${element.value.toUpperCase()}`;
		colContrato.textContent = `Contrato nº ${pneus[`${element.value}`][0].contrato}`;
		colFornecedora.textContent = `${pneus[`${element.value}`][0].fornecedora}`;
		endereco.textContent = `${pneus[`${element.value}`][0].lugar}`;
	}

	if (element.name === "medida") {
		const { medida, contrato, fornecedora, lugar } = pneus[`${aroValue}`].find((pneu) => pneu.medida == element.value);

		colDesc.textContent = `${medida} ${aroValue.toUpperCase()}`;
		colContrato.textContent = `Contrato nº ${contrato}`;
		colFornecedora.textContent = `${fornecedora}`;
		endereco.textContent = lugar;
	}

	if (element.name === "nomeMotorista") {
		nomeMotoristaField.textContent = element.value.trim();
	}
	if (element.name === "matricula") {
		matriculaField.textContent = element.value.trim();
	}
	if (element.name === "placa") {
		placaField.textContent = element.value.trim().toUpperCase();
	}
	if (element.name === "modelo") {
		modeloField.textContent = element.value.trim().toUpperCase();
	}
	if (element.name === "qtdPneus") {
		qtdPneusField.textContent = element.value;
	}
	if (element.name === "unidade") {
		unidadeField.textContent = element.value.trim().toUpperCase();
	}
	if (element.name === "dataRetirada") {
		const [ano, mes, dia] = element.value.split("-");

		// Criar data no horário local, sem UTC
		const data = new Date(ano, mes - 1, dia);

		let formatada = data.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});

		// Capitalizar primeira letra do mês

		dataRetiradaField.textContent = formatada;
	}
});
