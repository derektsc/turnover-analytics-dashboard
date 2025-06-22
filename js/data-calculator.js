class DataCalculator {
    constructor(analyzer) {
        this.analyzer = analyzer;
    }

    calculateSummary() {
        this.analyzer.summaryData.clear();

        let processedRows = 0;
        let validRows = 0;

        this.analyzer.filteredData.forEach((row, index) => {
            processedRows++;
            
            let mes = row['Mes'];
            let ano = row['Ano'];
            let status2 = row['Status_2'];

            // Limpar e converter dados
            if (mes) mes = String(mes).trim();
            if (ano) ano = String(ano).trim();
            if (status2) status2 = String(status2).trim();

            // Verificar se os dados são válidos
            if (!mes || !ano || !status2 || mes === '' || ano === '' || status2 === '') {
                return;
            }

            // Converter mes e ano para números se necessário
            const mesNum = isNaN(mes) ? mes : parseInt(mes);
            const anoNum = isNaN(ano) ? ano : parseInt(ano);

            const key = `${anoNum}-${String(mesNum).padStart(2, '0')}`;
            
            if (!this.analyzer.summaryData.has(key)) {
                this.analyzer.summaryData.set(key, {
                    ano: anoNum,
                    mes: mesNum,
                    Ativo: 0,
                    AtivoMes: 0,
                    DesligadoMes: 0,
                    Desligado: 0,
                    turnover: 0
                });
            }

            const summary = this.analyzer.summaryData.get(key);
            
            // Mapear os novos valores para as propriedades internas
            const statusMapping = {
                'Ativo': 'Ativo',
                'Ativo mês': 'AtivoMes',
                'Desligado mês': 'DesligadoMes',
                'Desligado': 'Desligado'
            };
            
            // Verificar se o status existe no mapeamento
            if (statusMapping.hasOwnProperty(status2)) {
                const mappedStatus = statusMapping[status2];
                summary[mappedStatus]++;
                validRows++;
            }
        });


        // Calcular turnover para cada período
        this.analyzer.summaryData.forEach((summary, key) => {
            const { Ativo, AtivoMes, DesligadoMes } = summary;
            if (Ativo > 0) {
                summary.turnover = (((AtivoMes + DesligadoMes) / 2) / Ativo) * 100;
            } else {
                summary.turnover = 0;
            }
        });

    }

    calculateColaboradorData() {
        this.analyzer.colaboradorData.clear();

        let processedRows = 0;
        let validRows = 0;

        // Primeiro, agrupar dados por mês/ano
        const monthlyData = new Map();

        this.analyzer.filteredData.forEach((row, index) => {
            processedRows++;
            
            let mes = row['Mes'];
            let ano = row['Ano'];
            let status = row['Status'];
            let tipoDesligamento = row['Tipo de desligamento'];

            // Limpar e converter dados
            if (mes) mes = String(mes).trim();
            if (ano) ano = String(ano).trim();
            if (status) status = String(status).trim();
            if (tipoDesligamento) tipoDesligamento = String(tipoDesligamento).trim();

            // Verificar se os dados são válidos
            if (!mes || !ano || !status || mes === '' || ano === '' || status === '') {
                return;
            }

            // Converter mes e ano para números se necessário
            const mesNum = isNaN(mes) ? mes : parseInt(mes);
            const anoNum = isNaN(ano) ? ano : parseInt(ano);

            const key = `${anoNum}-${String(mesNum).padStart(2, '0')}`;
            
            if (!monthlyData.has(key)) {
                monthlyData.set(key, {
                    ano: anoNum,
                    mes: mesNum,
                    ativosTotal: 0,
                    desligadosColaborador: 0
                });
            }

            const monthData = monthlyData.get(key);
            
            // Contar ativos (todos)
            if (status.toLowerCase().includes('ativo')) {
                monthData.ativosTotal++;
                validRows++;
            }
            
            // Contar desligados apenas se for "Colaborador"
            if (status.toLowerCase().includes('desligado') && 
                tipoDesligamento && 
                tipoDesligamento.toLowerCase().includes('colaborador')) {
                monthData.desligadosColaborador++;
                validRows++;
            }
        });


        // Calcular taxa para cada período
        monthlyData.forEach((data, key) => {
            const { ativosTotal, desligadosColaborador } = data;
            let taxa = 0;
            
            if (ativosTotal > 0) {
                taxa = (desligadosColaborador / ativosTotal) * 100;
            }
            
            this.analyzer.colaboradorData.set(key, {
                ano: data.ano,
                mes: data.mes,
                ativosTotal: ativosTotal,
                desligadosColaborador: desligadosColaborador,
                taxa: taxa
            });
        });

    }

    calculateEmpresaData() {
        this.analyzer.empresaData.clear();

        let processedRows = 0;
        let validRows = 0;

        // Primeiro, agrupar dados por mês/ano
        const monthlyData = new Map();

        this.analyzer.filteredData.forEach((row, index) => {
            processedRows++;
            
            let mes = row['Mes'];
            let ano = row['Ano'];
            let status = row['Status'];
            let tipoDesligamento = row['Tipo de desligamento'];

            // Limpar e converter dados
            if (mes) mes = String(mes).trim();
            if (ano) ano = String(ano).trim();
            if (status) status = String(status).trim();
            if (tipoDesligamento) tipoDesligamento = String(tipoDesligamento).trim();

            // Verificar se os dados são válidos
            if (!mes || !ano || !status || mes === '' || ano === '' || status === '') {
                return;
            }

            // Converter mes e ano para números se necessário
            const mesNum = isNaN(mes) ? mes : parseInt(mes);
            const anoNum = isNaN(ano) ? ano : parseInt(ano);

            const key = `${anoNum}-${String(mesNum).padStart(2, '0')}`;
            
            if (!monthlyData.has(key)) {
                monthlyData.set(key, {
                    ano: anoNum,
                    mes: mesNum,
                    ativosTotal: 0,
                    desligadosEmpresa: 0
                });
            }

            const monthData = monthlyData.get(key);
            
            // Contar ativos (todos)
            if (status.toLowerCase().includes('ativo')) {
                monthData.ativosTotal++;
                validRows++;
            }
            
            // Contar desligados apenas se for "Empresa"
            if (status.toLowerCase().includes('desligado') && 
                tipoDesligamento && 
                tipoDesligamento.toLowerCase().includes('empresa')) {
                monthData.desligadosEmpresa++;
                validRows++;
            }
        });


        // Calcular taxa para cada período
        monthlyData.forEach((data, key) => {
            const { ativosTotal, desligadosEmpresa } = data;
            let taxa = 0;
            
            if (ativosTotal > 0) {
                taxa = (desligadosEmpresa / ativosTotal) * 100;
            }
            
            this.analyzer.empresaData.set(key, {
                ano: data.ano,
                mes: data.mes,
                ativosTotal: ativosTotal,
                desligadosEmpresa: desligadosEmpresa,
                taxa: taxa
            });
        });

    }
}
