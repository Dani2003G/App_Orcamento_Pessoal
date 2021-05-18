/*
**** Página index.html ****
*/

class Despesa {
	constructor(Ano, Mes, Dia, Tipo, Descricao, Valor){
		this.Ano = Ano
		this.Mes = Mes
		this.Dia = Dia
		this.Tipo = Tipo
		this.Descricao = Descricao
		this.Valor = Valor
	}

	ValidarDados() {
		for(let I in this) {
			if (this[I] == undefined || this[I] == '' || this[I] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id') // null
		return parseInt(proximoId) + 1
	}

	Gravar(D) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(D))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		// Array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		// Recuperar todas as despesas cadastradas em localStorage
		for(let I = 1; I <= id; I++){

			// Recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(I))

			// Existe a possibilidade de haver Índices que foram pulados/removidos
			// Nestes casos nós vamos pular esse Índices
			if (despesa === null) {
				continue
			}

			despesa.id = I
			
			despesas.push(despesa)
		}

		return despesas
	}	

	Pesquisar(despesa) {
		let DespesasFiltradas = Array()
		DespesasFiltradas = this.recuperarTodosRegistros()
	
		// Ano
		if (despesa.Ano != '') {
			DespesasFiltradas = DespesasFiltradas.filter(F => F.Ano == despesa.Ano)
		}
		// Mes
		if (despesa.Mes != '') {
			DespesasFiltradas = DespesasFiltradas.filter(F => F.Mes == despesa.Mes)
		}
		// Dia
		if (despesa.Dia != '') {
			DespesasFiltradas = DespesasFiltradas.filter(F => F.Dia == despesa.Dia)
		}
		// Tipo
		if (despesa.Tipo != '') {
			DespesasFiltradas = DespesasFiltradas.filter(F => F.Tipo == despesa.Tipo)
		}
		// Descrição
		if (despesa.Descricao != '') {
			DespesasFiltradas = DespesasFiltradas.filter(F => F.Descricao == despesa.Descricao)
		}
		// Valor
		if (despesa.Valor != '') {
			DespesasFiltradas = DespesasFiltradas.filter(F => F.Valor == despesa.Valor)
		}
		return DespesasFiltradas	
	}

	Remover(id){
		localStorage.removeItem(id)
	}

}

let bd = new Bd()

function CadastrarDespesa() {
	
	let Ano = document.getElementById('Ano')
	let Mes = document.getElementById('Mes')
	let Dia = document.getElementById('Dia')
	let Tipo = document.getElementById('Tipo')
	let Descricao = document.getElementById('Descricao')
	let Valor = document.getElementById('Valor')

	let despesa = new Despesa(Ano.value, Mes.value, Dia.value,
		Tipo.value, Descricao.value, Valor.value)

	if(despesa.ValidarDados()){
		bd.Gravar(despesa)
		//$('#SucessoGravacao').modal('show')
		document.getElementById('Modal_Titulo_Div').className = 'modal-header text-success'
		document.getElementById('Modal_Titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('Modal_Conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('Modal_Btn').className = 'btn btn-success'
		document.getElementById('Modal_Btn').innerHTML = 'Voltar'

		// Dialogo de sucesso
		$('#ModalRegistraDespesa').modal('show')	

		Ano.value = ''
		Mes.value = ''
		Dia.value = ''
		Tipo.value = ''
		Descricao.value = ''
		Valor.value = ''

	} else {
		//$('#ErroGravacao').modal('show')
		document.getElementById('Modal_Titulo_Div').className = 'modal-header text-danger'
		document.getElementById('Modal_Titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('Modal_Conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente'
		document.getElementById('Modal_Btn').className = 'btn btn-danger'
		document.getElementById('Modal_Btn').innerHTML = 'Voltar e corrigir'

		// Dialogo de erro
		$('#ModalRegistraDespesa').modal('show')	
	}
}

/*
**** Página consulta.html ****
*/

function CarregaListaDespesas(despesas = Array(), filtro = false) {
	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	// Selecionando o elemento Tbody da tabela
	let ListaDespesas = document.getElementById('ListaDespesas')
	ListaDespesas.innerHTML = ''

	/*
		<tr>
            0 = <td>15/03/2018</td>
            1 = <td>Alimentação</td>
            2 = <td>Compras do mês</td>
            3 = <td>122.12</td>
        </tr>
	*/

	// Pecorrer o Array despesas, listando caa despesa de forma dinâmica
	despesas.forEach(function(d) {

		// Criando a linha (tr)
		let Linha = ListaDespesas.insertRow()

		// Criar as colunas (td)
		Linha.insertCell(0).innerHTML = `${d.Dia}/${d.Mes}/${d.Ano}`
		
		// Ajustar o tipo
		switch(parseInt(d.Tipo)){
			case 1 : d.Tipo = 'Alimentação'
				break
			case 2 : d.Tipo = 'Educação'
				break
			case 3 : d.Tipo = 'Lazer'
				break
			case 4 : d.Tipo = 'Saúde'
				break
			case 5 : d.Tipo = 'Transporte'
				break
		}

		Linha.insertCell(1).innerHTML = d.Tipo
		Linha.insertCell(2).innerHTML = d.Descricao
		Linha.insertCell(3).innerHTML = d.Valor

		// Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function() {// remover a despesa
			let id = this.id.replace('id_despesa_', '')	

			//alert(id)
			bd.Remover(id)
			window.location.reload()
		}

		Linha.insertCell(4).append(btn)

		console.log(d)
			
	})
}

function PesquisarDespesa() {
	let Ano = document.getElementById('Ano').value
	let Mes = document.getElementById('Mes').value
	let Dia = document.getElementById('Dia').value
	let Tipo = document.getElementById('Tipo').value
	let Descricao = document.getElementById('Descricao').value
	let Valor = document.getElementById('Valor').value

	let despesa = new Despesa(Ano, Mes, Dia, Tipo, Descricao, Valor)
	
	let despesas = bd.Pesquisar(despesa)

	CarregaListaDespesas(despesas, true)
}