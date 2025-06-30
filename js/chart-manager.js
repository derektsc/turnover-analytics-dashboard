class ChartManager {
    constructor(analyzer) {
        this.analyzer = analyzer;
        this.charts = {
            turnover: null,
            cargo: null,
            tempo: null,
            geracao: null,
            tipoDesligamento: null,
            taxaColaborador: null,
            cargoColaborador: null,
            tempoColaborador: null, // Nova propriedade
            geracaoColaborador: null, // Nova propriedade
            motivoColaborador: null, // Nova propriedade
            // Novos gráficos para empresa
            taxaEmpresa: null,
            cargoEmpresa: null,
            tempoEmpresa: null,
            geracaoEmpresa: null,
            motivoEmpresa: null,
            expanded: null
        };
    }

    destroyChart(chartName) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
            this.charts[chartName] = null;
        }
    }

    destroyAllCharts() {
        Object.keys(this.charts).forEach(chartName => {
            this.destroyChart(chartName);
        });
    }

    createTurnoverChart() {
        const ctx = document.getElementById('turnoverChart').getContext('2d');
        this.destroyChart('turnover');

        if (this.analyzer.summaryData.size === 0) {
            this.drawNoDataMessage(ctx, 'turnover');
            return;
        }

        const { datasets, sortedMonths } = this.prepareTurnoverData();
        const chartTitle = this.analyzer.getChartTitle('Evolução do Turnover por Mês');

        this.charts.turnover = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedMonths.map(month => `${month}`),
                datasets: datasets
            },
            options: this.getTurnoverChartOptions(chartTitle),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('turnoverChart', 'turnover-chart');
    }

    createTaxaColaboradorChart() {
        const ctx = document.getElementById('taxaColaboradorChart').getContext('2d');
        this.destroyChart('taxaColaborador');

        if (this.analyzer.colaboradorData.size === 0) {
            this.drawNoDataMessage(ctx, 'taxaColaborador');
            return;
        }

        const { datasets, sortedMonths } = this.prepareTaxaColaboradorData();
        const chartTitle = this.analyzer.getChartTitle('Taxa de Desligamento - Colaborador');

        this.charts.taxaColaborador = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedMonths.map(month => `${month}`),
                datasets: datasets
            },
            options: this.getTaxaColaboradorChartOptions(chartTitle),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('taxaColaboradorChart', 'taxa-colaborador-chart');
    }

    createCargoChart() {
        const ctx = document.getElementById('cargoChart').getContext('2d');
        this.destroyChart('cargo');

        const demissaoData = this.analyzer.filterDemissaoData();
        if (demissaoData.length === 0) {
            this.drawNoDataMessage(ctx, 'cargo');
            return;
        }

        const { datasets, topCargos } = this.prepareCargoData(demissaoData);
        const chartTitle = this.analyzer.getChartTitle('Demissões por Cargo');

        this.charts.cargo = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topCargos.map(cargo => cargo.length > 40 ? cargo.substring(0, 37) + '...' : cargo),
                datasets: datasets
            },
            options: this.getCargoChartOptions(chartTitle, topCargos),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('cargoChart', 'demissoes-cargo-chart');
    }

    createCargoColaboradorChart() {
        const ctx = document.getElementById('cargoColaboradorChart').getContext('2d');
        this.destroyChart('cargoColaborador');

        const demissaoColaboradorData = this.analyzer.filterDemissaoColaboradorData();
        if (demissaoColaboradorData.length === 0) {
            this.drawNoDataMessage(ctx, 'cargoColaborador');
            return;
        }

        const { datasets, topCargos } = this.prepareCargoColaboradorData(demissaoColaboradorData);
        const chartTitle = this.analyzer.getChartTitle('TOP 10 Demissões "Colaborador" por Cargo');

        this.charts.cargoColaborador = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topCargos.map(cargo => cargo.length > 35 ? cargo.substring(0, 32) + '...' : cargo),
                datasets: datasets
            },
            options: this.getCargoColaboradorChartOptions(chartTitle, topCargos),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('cargoColaboradorChart', 'top10-demissoes-colaborador-cargo-chart');
    }

    createTempoChart() {
        const ctx = document.getElementById('tempoChart').getContext('2d');
        this.destroyChart('tempo');

        const demissaoData = this.analyzer.filterDemissaoData();
        if (demissaoData.length === 0) {
            this.drawNoDataMessage(ctx, 'tempo');
            return;
        }

        const { datasets, categorias } = this.prepareTempoData(demissaoData);
        const chartTitle = this.analyzer.getChartTitle('Demissões por Tempo de Casa');

        this.charts.tempo = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categorias.map(categoria => categoria.length > 20 ? categoria.substring(0, 17) + '...' : categoria),
                datasets: datasets
            },
            options: this.getTempoChartOptions(chartTitle, categorias),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('tempoChart', 'demissoes-tempo-casa-chart');
    }

    createGeracaoChart() {
        const ctx = document.getElementById('geracaoChart').getContext('2d');
        this.destroyChart('geracao');

        const demissaoData = this.analyzer.filterDemissaoDataByField('Range-Idade');
        if (demissaoData.length === 0) {
            this.drawNoDataMessage(ctx, 'geracao');
            return;
        }

        const { datasets, geracoes } = this.prepareGeracaoData(demissaoData);
        const chartTitle = this.analyzer.getChartTitle('Demissões por Geração');

        this.charts.geracao = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: geracoes.map(geracao => geracao.includes('anos') ? geracao : `${geracao} anos`),
                datasets: datasets
            },
            options: this.getGeracaoChartOptions(chartTitle, geracoes),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('geracaoChart', 'demissoes-geracao-chart');
    }

    createTipoDesligamentoChart() {
        const ctx = document.getElementById('tipoDesligamentoChart').getContext('2d');
        this.destroyChart('tipoDesligamento');

        const demissaoData = this.analyzer.filterDemissaoDataByField('Tipo de desligamento');
        if (demissaoData.length === 0) {
            this.drawNoDataMessage(ctx, 'tipoDesligamento');
            return;
        }

        const { datasets, tipos } = this.prepareTipoDesligamentoData(demissaoData);
        const chartTitle = this.analyzer.getChartTitle('Tipos de Desligamento');

        this.charts.tipoDesligamento = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: tipos.map(tipo => tipo.length > 30 ? tipo.substring(0, 27) + '...' : tipo),
                datasets: datasets
            },
            options: this.getTipoDesligamentoChartOptions(chartTitle, tipos),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('tipoDesligamentoChart', 'tipos-desligamento-chart');
    }

    createTempoColaboradorChart() {
        const ctx = document.getElementById('tempoColaboradorChart').getContext('2d');
        this.destroyChart('tempoColaborador');

        const demissaoColaboradorData = this.analyzer.filterDemissaoColaboradorData();
        if (demissaoColaboradorData.length === 0) {
            this.drawNoDataMessage(ctx, 'tempoColaborador');
            return;
        }

        const { datasets, categorias } = this.prepareTempoColaboradorData(demissaoColaboradorData);
        const chartTitle = this.analyzer.getChartTitle('Tempo de Casa - Demissões "Colaborador"');

        this.charts.tempoColaborador = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categorias.map(categoria => categoria.length > 20 ? categoria.substring(0, 17) + '...' : categoria),
                datasets: datasets
            },
            options: this.getTempoColaboradorChartOptions(chartTitle, categorias),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('tempoColaboradorChart', 'tempo-casa-colaborador-chart');
    }

    createGeracaoColaboradorChart() {
        const ctx = document.getElementById('geracaoColaboradorChart').getContext('2d');
        this.destroyChart('geracaoColaborador');

        const demissaoColaboradorData = this.analyzer.filterDemissaoColaboradorDataByField('Range-Idade');
        if (demissaoColaboradorData.length === 0) {
            this.drawNoDataMessage(ctx, 'geracaoColaborador');
            return;
        }

        const { datasets, geracoes } = this.prepareGeracaoColaboradorData(demissaoColaboradorData);
        const chartTitle = this.analyzer.getChartTitle('Demissões "Colaborador" por Geração');

        this.charts.geracaoColaborador = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: geracoes.map(geracao => geracao.includes('anos') ? geracao : `${geracao} anos`),
                datasets: datasets
            },
            options: this.getGeracaoColaboradorChartOptions(chartTitle, geracoes),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('geracaoColaboradorChart', 'demissoes-colaborador-geracao-chart');
    }

    createMotivoColaboradorChart() {
        const ctx = document.getElementById('motivoColaboradorChart').getContext('2d');
        this.destroyChart('motivoColaborador');

        const demissaoColaboradorData = this.analyzer.filterDemissaoColaboradorDataByField('Motivo desligamento');
        if (demissaoColaboradorData.length === 0) {
            this.drawNoDataMessage(ctx, 'motivoColaborador');
            return;
        }

        const { datasets, motivos } = this.prepareMotivoColaboradorData(demissaoColaboradorData);
        const chartTitle = this.analyzer.getChartTitle('Motivos de Desligamento - "Colaborador"');

        this.charts.motivoColaborador = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: motivos.map(motivo => motivo.length > 35 ? motivo.substring(0, 32) + '...' : motivo),
                datasets: datasets
            },
            options: this.getMotivoColaboradorChartOptions(chartTitle, motivos),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('motivoColaboradorChart', 'motivos-colaborador-chart');
    }

    createTaxaEmpresaChart() {
        const ctx = document.getElementById('taxaEmpresaChart').getContext('2d');
        this.destroyChart('taxaEmpresa');

        if (this.analyzer.empresaData.size === 0) {
            this.drawNoDataMessage(ctx, 'taxaEmpresa');
            return;
        }

        const { datasets, sortedMonths } = this.prepareTaxaEmpresaData();
        const chartTitle = this.analyzer.getChartTitle('Taxa de Desligamento - Empresa');

        this.charts.taxaEmpresa = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedMonths.map(month => `${month}`),
                datasets: datasets
            },
            options: this.getTaxaEmpresaChartOptions(chartTitle),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('taxaEmpresaChart', 'taxa-empresa-chart');
    }

    createCargoEmpresaChart() {
        const ctx = document.getElementById('cargoEmpresaChart').getContext('2d');
        this.destroyChart('cargoEmpresa');

        const demissaoEmpresaData = this.analyzer.filterDemissaoEmpresaData();
        if (demissaoEmpresaData.length === 0) {
            this.drawNoDataMessage(ctx, 'cargoEmpresa');
            return;
        }

        const { datasets, topCargos } = this.prepareCargoEmpresaData(demissaoEmpresaData);
        const chartTitle = this.analyzer.getChartTitle('TOP 10 Demissões "Empresa" por Cargo');

        this.charts.cargoEmpresa = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topCargos.map(cargo => cargo.length > 35 ? cargo.substring(0, 32) + '...' : cargo),
                datasets: datasets
            },
            options: this.getCargoEmpresaChartOptions(chartTitle, topCargos),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('cargoEmpresaChart', 'top10-demissoes-empresa-cargo-chart');
    }

    createTempoEmpresaChart() {
        const ctx = document.getElementById('tempoEmpresaChart').getContext('2d');
        this.destroyChart('tempoEmpresa');

        const demissaoEmpresaData = this.analyzer.filterDemissaoEmpresaData();
        if (demissaoEmpresaData.length === 0) {
            this.drawNoDataMessage(ctx, 'tempoEmpresa');
            return;
        }

        const { datasets, categorias } = this.prepareTempoEmpresaData(demissaoEmpresaData);
        const chartTitle = this.analyzer.getChartTitle('Tempo de Casa - Demissões "Empresa"');

        this.charts.tempoEmpresa = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categorias.map(categoria => categoria.length > 20 ? categoria.substring(0, 17) + '...' : categoria),
                datasets: datasets
            },
            options: this.getTempoEmpresaChartOptions(chartTitle, categorias),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('tempoEmpresaChart', 'tempo-casa-empresa-chart');
    }

    createGeracaoEmpresaChart() {
        const ctx = document.getElementById('geracaoEmpresaChart').getContext('2d');
        this.destroyChart('geracaoEmpresa');

        const demissaoEmpresaData = this.analyzer.filterDemissaoEmpresaDataByField('Range-Idade');
        if (demissaoEmpresaData.length === 0) {
            this.drawNoDataMessage(ctx, 'geracaoEmpresa');
            return;
        }

        const { datasets, geracoes } = this.prepareGeracaoEmpresaData(demissaoEmpresaData);
        const chartTitle = this.analyzer.getChartTitle('Demissões "Empresa" por Geração');

        this.charts.geracaoEmpresa = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: geracoes.map(geracao => geracao.includes('anos') ? geracao : `${geracao} anos`),
                datasets: datasets
            },
            options: this.getGeracaoEmpresaChartOptions(chartTitle, geracoes),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('geracaoEmpresaChart', 'demissoes-empresa-geracao-chart');
    }

    createMotivoEmpresaChart() {
        const ctx = document.getElementById('motivoEmpresaChart').getContext('2d');
        this.destroyChart('motivoEmpresa');

        const demissaoEmpresaData = this.analyzer.filterDemissaoEmpresaDataByField('Motivo desligamento');
        if (demissaoEmpresaData.length === 0) {
            this.drawNoDataMessage(ctx, 'motivoEmpresa');
            return;
        }

        const { datasets, motivos } = this.prepareMotivoEmpresaData(demissaoEmpresaData);
        const chartTitle = this.analyzer.getChartTitle('Motivos de Desligamento - "Empresa"');

        this.charts.motivoEmpresa = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: motivos.map(motivo => motivo.length > 35 ? motivo.substring(0, 32) + '...' : motivo),
                datasets: datasets
            },
            options: this.getMotivoEmpresaChartOptions(chartTitle, motivos),
            plugins: [ChartDataLabels]
        });

        this.addDownloadButton('motivoEmpresaChart', 'motivos-empresa-chart');
    }

    // Data preparation methods
    prepareTurnoverData() {
        const dataByYear = new Map();
        
        this.analyzer.summaryData.forEach((data, key) => {
            const year = data.ano;
            if (!dataByYear.has(year)) {
                dataByYear.set(year, []);
            }
            dataByYear.get(year).push({
                month: data.mes,
                turnover: data.turnover,
                key: key
            });
        });

        dataByYear.forEach((months, year) => {
            months.sort((a, b) => a.month - b.month);
        });

        const datasets = [];
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        let colorIndex = 0;

        const allMonths = new Set();
        dataByYear.forEach((months) => {
            months.forEach(item => allMonths.add(item.month));
        });
        const sortedMonths = Array.from(allMonths).sort((a, b) => a - b);

        dataByYear.forEach((months, year) => {
            const monthData = sortedMonths.map(month => {
                const found = months.find(item => item.month === month);
                return found ? found.turnover : null;
            });

            datasets.push({
                label: `Ano ${year}`,
                data: monthData,
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: colors[colorIndex % colors.length] + '20',
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 8,
                spanGaps: true
            });
            colorIndex++;
        });

        return { datasets, sortedMonths };
    }

    prepareTaxaColaboradorData() {
        const dataByYear = new Map();
        
        this.analyzer.colaboradorData.forEach((data, key) => {
            const year = data.ano;
            if (!dataByYear.has(year)) {
                dataByYear.set(year, []);
            }
            dataByYear.get(year).push({
                month: data.mes,
                taxa: data.taxa,
                key: key
            });
        });

        dataByYear.forEach((months, year) => {
            months.sort((a, b) => a.month - b.month);
        });

        const datasets = [];
        const colors = ['#DA627D', '#A53860', '#8B2635', '#B85A6E', '#C46B7A', '#7A4B5C'];
        let colorIndex = 0;

        const allMonths = new Set();
        dataByYear.forEach((months) => {
            months.forEach(item => allMonths.add(item.month));
        });
        const sortedMonths = Array.from(allMonths).sort((a, b) => a - b);

        dataByYear.forEach((months, year) => {
            const monthData = sortedMonths.map(month => {
                const found = months.find(item => item.month === month);
                return found ? found.taxa : null;
            });

            datasets.push({
                label: `Ano ${year}`,
                data: monthData,
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: colors[colorIndex % colors.length] + '20',
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 8,
                spanGaps: true
            });
            colorIndex++;
        });

        return { datasets, sortedMonths };
    }

    prepareCargoData(demissaoData) {
        const cargosByYear = this.groupDataByYearAndField(demissaoData, 'Denominação de Cargo');
        const topCargos = this.getTopItems(cargosByYear, 10);
        const datasets = this.createDatasets(cargosByYear, topCargos);
        return { datasets, topCargos };
    }

    prepareCargoColaboradorData(demissaoColaboradorData) {
        const cargosByYear = this.groupDataByYearAndField(demissaoColaboradorData, 'Denominação de Cargo');
        const topCargos = this.getTopItems(cargosByYear, 10);
        const datasets = this.createDatasets(cargosByYear, topCargos);
        return { datasets, topCargos };
    }

    prepareTempoData(demissaoData) {
        const temposByYear = this.groupDataByYearAndField(demissaoData, 'Tempo de casa');
        const categorias = this.getAllItems(temposByYear).sort();
        const datasets = this.createDatasets(temposByYear, categorias);
        return { datasets, categorias };
    }

    prepareTempoColaboradorData(demissaoColaboradorData) {
        const temposByYear = this.groupDataByYearAndField(demissaoColaboradorData, 'Tempo de casa');
        
        // Obter todas as categorias de tempo de casa e ordená-las
        const todasCategorias = new Set();
        temposByYear.forEach(tempos => {
            tempos.forEach((count, categoria) => todasCategorias.add(categoria));
        });

        // Converter para array e ordenar de forma mais inteligente
        const categorias = Array.from(todasCategorias).sort((a, b) => {
            // Função para extrair números e ordenar categorias de tempo
            const extractTimeValue = (timeStr) => {
                const str = timeStr.toLowerCase();
                
                // Se contém "ano" ou "anos", extrair o número
                if (str.includes('ano')) {
                    const match = str.match(/(\d+)/);
                    return match ? parseInt(match[1]) * 12 : 0; // Converter anos para meses
                }
                
                // Se contém "mes" ou "meses", extrair o número
                if (str.includes('mes')) {
                    const match = str.match(/(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                }
                
                // Se contém "dia" ou "dias", considerar como 0 meses
                if (str.includes('dia')) {
                    return 0;
                }
                
                // Para outros casos, tentar extrair o primeiro número
                const match = str.match(/(\d+)/);
                return match ? parseInt(match[1]) : 999;
            };
            
            return extractTimeValue(a) - extractTimeValue(b);
        });
        
        const datasets = this.createDatasets(temposByYear, categorias);
        return { datasets, categorias };
    }

    prepareGeracaoData(demissaoData) {
        const geracoesByYear = this.groupDataByYearAndField(demissaoData, 'Range-Idade');
        const geracoes = this.getAllItems(geracoesByYear).sort((a, b) => {
            const getFirstNumber = (range) => {
                const match = range.match(/(\d+)/);
                return match ? parseInt(match[1]) : 999;
            };
            return getFirstNumber(a) - getFirstNumber(b);
        });
        const datasets = this.createDatasets(geracoesByYear, geracoes);
        return { datasets, geracoes };
    }

    prepareGeracaoColaboradorData(demissaoColaboradorData) {
        const geracoesByYear = this.groupDataByYearAndField(demissaoColaboradorData, 'Range-Idade');
        
        // Obter todas as gerações únicas
        const todasGeracoes = new Set();
        geracoesByYear.forEach(geracoes => {
            geracoes.forEach((count, geracao) => todasGeracoes.add(geracao));
        });

        // Converter para array e ordenar por faixa etária
        const geracoes = Array.from(todasGeracoes).sort((a, b) => {
            // Extrair o primeiro número de cada range para ordenação
            const getFirstNumber = (range) => {
                const match = range.match(/(\d+)/);
                return match ? parseInt(match[1]) : 999;
            };
            
            return getFirstNumber(a) - getFirstNumber(b);
        });
        
        const datasets = this.createDatasets(geracoesByYear, geracoes);
        return { datasets, geracoes };
    }

    prepareTipoDesligamentoData(demissaoData) {
        const tiposByYear = this.groupDataByYearAndField(demissaoData, 'Tipo de desligamento');
        const tipos = this.getAllItems(tiposByYear).sort();
        const datasets = this.createDatasets(tiposByYear, tipos);
        return { datasets, tipos };
    }

    prepareMotivoColaboradorData(demissaoColaboradorData) {
        const motivosByYear = this.groupDataByYearAndField(demissaoColaboradorData, 'Motivo desligamento');
        
        // Obter todos os motivos únicos
        const todosMotivos = new Set();
        motivosByYear.forEach(motivos => {
            motivos.forEach((count, motivo) => todosMotivos.add(motivo));
        });

        // Converter para array e ordenar alfabeticamente
        const motivos = Array.from(todosMotivos).sort((a, b) => {
            // Ordenação alfabética, mas colocando valores vazios no final
            if (a === '' || a === null || a === undefined) return 1;
            if (b === '' || b === null || b === undefined) return -1;
            return a.localeCompare(b, 'pt-BR');
        });
        
        const datasets = this.createDatasets(motivosByYear, motivos);
        return { datasets, motivos };
    }

    prepareTaxaEmpresaData() {
        const dataByYear = new Map();
        
        this.analyzer.empresaData.forEach((data, key) => {
            const year = data.ano;
            if (!dataByYear.has(year)) {
                dataByYear.set(year, []);
            }
            dataByYear.get(year).push({
                month: data.mes,
                taxa: data.taxa,
                key: key
            });
        });

        dataByYear.forEach((months, year) => {
            months.sort((a, b) => a.month - b.month);
        });

        const datasets = [];
        const colors = ['#4facfe', '#00f2fe', '#667eea', '#764ba2', '#f093fb', '#f5576c'];
        let colorIndex = 0;

        const allMonths = new Set();
        dataByYear.forEach((months) => {
            months.forEach(item => allMonths.add(item.month));
        });
        const sortedMonths = Array.from(allMonths).sort((a, b) => a - b);

        dataByYear.forEach((months, year) => {
            const monthData = sortedMonths.map(month => {
                const found = months.find(item => item.month === month);
                return found ? found.taxa : null;
            });

            datasets.push({
                label: `Ano ${year}`,
                data: monthData,
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: colors[colorIndex % colors.length] + '20',
                tension: 0.4,
                fill: false,
                pointRadius: 6,
                pointHoverRadius: 8,
                spanGaps: true
            });
            colorIndex++;
        });

        return { datasets, sortedMonths };
    }

    prepareCargoEmpresaData(demissaoEmpresaData) {
        const cargosByYear = this.groupDataByYearAndField(demissaoEmpresaData, 'Denominação de Cargo');
        const topCargos = this.getTopItems(cargosByYear, 10);
        const datasets = this.createDatasets(cargosByYear, topCargos);
        return { datasets, topCargos };
    }

    prepareTempoEmpresaData(demissaoEmpresaData) {
        const temposByYear = this.groupDataByYearAndField(demissaoEmpresaData, 'Tempo de casa');
        
        const todasCategorias = new Set();
        temposByYear.forEach(tempos => {
            tempos.forEach((count, categoria) => todasCategorias.add(categoria));
        });

        const categorias = Array.from(todasCategorias).sort((a, b) => {
            const extractTimeValue = (timeStr) => {
                const str = timeStr.toLowerCase();
                
                if (str.includes('ano')) {
                    const match = str.match(/(\d+)/);
                    return match ? parseInt(match[1]) * 12 : 0;
                }
                
                if (str.includes('mes')) {
                    const match = str.match(/(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                }
                
                if (str.includes('dia')) {
                    return 0;
                }
                
                const match = str.match(/(\d+)/);
                return match ? parseInt(match[1]) : 999;
            };
            
            return extractTimeValue(a) - extractTimeValue(b);
        });
        
        const datasets = this.createDatasets(temposByYear, categorias);
        return { datasets, categorias };
    }

    prepareGeracaoEmpresaData(demissaoEmpresaData) {
        const geracoesByYear = this.groupDataByYearAndField(demissaoEmpresaData, 'Range-Idade');
        
        const todasGeracoes = new Set();
        geracoesByYear.forEach(geracoes => {
            geracoes.forEach((count, geracao) => todasGeracoes.add(geracao));
        });

        const geracoes = Array.from(todasGeracoes).sort((a, b) => {
            const getFirstNumber = (range) => {
                const match = range.match(/(\d+)/);
                return match ? parseInt(match[1]) : 999;
            };
            
            return getFirstNumber(a) - getFirstNumber(b);
        });
        
        const datasets = this.createDatasets(geracoesByYear, geracoes);
        return { datasets, geracoes };
    }

    prepareMotivoEmpresaData(demissaoEmpresaData) {
        const motivosByYear = this.groupDataByYearAndField(demissaoEmpresaData, 'Motivo desligamento');
        
        const todosMotivos = new Set();
        motivosByYear.forEach(motivos => {
            motivos.forEach((count, motivo) => todosMotivos.add(motivo));
        });

        const motivos = Array.from(todosMotivos).sort((a, b) => {
            if (a === '' || a === null || a === undefined) return 1;
            if (b === '' || b === null || b === undefined) return -1;
            return a.localeCompare(b, 'pt-BR');
        });
        
        const datasets = this.createDatasets(motivosByYear, motivos);
        return { datasets, motivos };
    }

    // Utility methods
    groupDataByYearAndField(data, fieldName) {
        const groupedByYear = new Map();
        
        data.forEach(row => {
            const ano = parseInt(row['Ano']);
            const fieldValue = String(row[fieldName]).trim();
            
            if (!ano || !fieldValue || fieldValue === '') return;
            
            if (!groupedByYear.has(ano)) {
                groupedByYear.set(ano, new Map());
            }
            
            const yearData = groupedByYear.get(ano);
            yearData.set(fieldValue, (yearData.get(fieldValue) || 0) + 1);
        });

        return groupedByYear;
    }

    getTopItems(dataByYear, limit) {
        const allItems = new Set();
        dataByYear.forEach(items => {
            items.forEach((count, item) => allItems.add(item));
        });
        
        const itemTotals = new Map();
        allItems.forEach(item => {
            let total = 0;
            dataByYear.forEach(items => {
                total += items.get(item) || 0;
            });
            itemTotals.set(item, total);
        });
        
        return Array.from(itemTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);
    }

    getAllItems(dataByYear) {
        const allItems = new Set();
        dataByYear.forEach(items => {
            items.forEach((count, item) => allItems.add(item));
        });
        return Array.from(allItems);
    }

    createDatasets(dataByYear, items) {
        const datasets = [];
        const colors = ['#DA627D', '#A53860', '#8B2635', '#B85A6E', '#C46B7A', '#7A4B5C'];
        
        const sortedYears = Array.from(dataByYear.keys()).sort((a, b) => a - b);
        
        sortedYears.forEach((year, yearIndex) => {
            const yearData = dataByYear.get(year);
            const data = items.map(item => yearData.get(item) || 0);
            
            datasets.push({
                label: `${year}`,
                data: data,
                backgroundColor: colors[yearIndex % colors.length],
                borderColor: colors[yearIndex % colors.length],
                borderWidth: 1
            });
        });

        return datasets;
    }

    // Chart options methods
    getTurnoverChartOptions(chartTitle) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: chartTitle, font: { size: 18, weight: 'bold' } },
                legend: { position: 'top', labels: { font: { size: 14 } } },
                datalabels: {
                    display: true,
                    align: 'top',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value ? value.toFixed(2) + '%' : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Turnover (%)', font: { size: 14, weight: 'bold' } },
                    ticks: { callback: (value) => value.toFixed(2) + '%' }
                },
                x: { title: { display: true, text: 'Meses', font: { size: 14, weight: 'bold' } } }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('turnover', chartTitle, this.charts.turnover)
        };
    }

    getTaxaColaboradorChartOptions(chartTitle) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: chartTitle, font: { size: 18, weight: 'bold' } },
                legend: { position: 'top', labels: { font: { size: 14 } } },
                datalabels: {
                    display: true,
                    align: 'top',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value ? value.toFixed(2) + '%' : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Taxa (%)', font: { size: 14, weight: 'bold' } },
                    ticks: { callback: (value) => value.toFixed(2) + '%' }
                },
                x: { title: { display: true, text: 'Meses', font: { size: 14, weight: 'bold' } } }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('taxaColaborador', chartTitle, this.charts.taxaColaborador)
        };
    }

    getCargoChartOptions(chartTitle, topCargos) {
        return this.getHorizontalBarChartOptions(chartTitle, topCargos, 'Quantidade de Demissões', 'Cargos', 'cargo');
    }

    getCargoColaboradorChartOptions(chartTitle, topCargos) {
        return this.getHorizontalBarChartOptions(chartTitle, topCargos, 'Quantidade de Demissões "Colaborador"', 'Cargos', 'cargoColaborador');
    }

    getTempoChartOptions(chartTitle, categorias) {
        return this.getVerticalBarChartOptions(chartTitle, categorias, 'Quantidade de Demissões', 'Tempo de Casa', 'tempo');
    }

    getTempoColaboradorChartOptions(chartTitle, categorias) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: chartTitle, 
                    font: { size: 18, weight: 'bold' } 
                },
                legend: { 
                    position: 'top', 
                    labels: { font: { size: 14 } } 
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            // Mostrar o nome completo da categoria no tooltip
                            return categorias[context[0].dataIndex];
                        },
                        afterLabel: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            if (total > 0) {
                                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `${percentage}% do total do ano`;
                            }
                            return '';
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Quantidade de Demissões "Colaborador"', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { stepSize: 1 }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Tempo de Casa', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { 
                        maxRotation: 45, 
                        minRotation: 45 
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('tempoColaborador', chartTitle, this.charts.tempoColaborador)
        };
    }

    getGeracaoChartOptions(chartTitle, geracoes) {
        return this.getVerticalBarChartOptions(chartTitle, geracoes, 'Quantidade de Demissões', 'Faixa Etária', 'geracao');
    }

    getGeracaoColaboradorChartOptions(chartTitle, geracoes) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: chartTitle, 
                    font: { size: 18, weight: 'bold' } 
                },
                legend: { 
                    position: 'top', 
                    labels: { font: { size: 14 } } 
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            // Mostrar o nome completo da geração no tooltip
                            return geracoes[context[0].dataIndex];
                        },
                        afterLabel: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            if (total > 0) {
                                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `${percentage}% do total do ano`;
                            }
                            return '';
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Quantidade de Demissões "Colaborador"', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { stepSize: 1 }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Faixa Etária', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { 
                        maxRotation: 45, 
                        minRotation: 45 
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('geracaoColaborador', chartTitle, this.charts.geracaoColaborador)
        };
    }

    getTipoDesligamentoChartOptions(chartTitle, tipos) {
        return this.getHorizontalBarChartOptions(chartTitle, tipos, 'Quantidade de Desligamentos', 'Tipos de Desligamento', 'tipoDesligamento');
    }

    getMotivoColaboradorChartOptions(chartTitle, motivos) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: { 
                    display: true, 
                    text: chartTitle, 
                    font: { size: 18, weight: 'bold' } 
                },
                legend: { 
                    position: 'top', 
                    labels: { font: { size: 14 } } 
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            const originalIndex = context[0].dataIndex;
                            return motivos[originalIndex] || context[0].label;
                        },
                        afterLabel: (context) => {
                            const originalIndex = context.dataIndex;
                            return `Motivo completo: ${motivos[originalIndex] || context.label}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end', // Centralizar dentro da barra
                    align: 'center',  // Alinhar no centro
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo branco semi-transparente
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Quantidade de Desligamentos "Colaborador"', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { stepSize: 1 }
                },
                y: {
                    title: { 
                        display: true, 
                        text: 'Motivo de Desligamento', 
                        font: { size: 14, weight: 'bold' } 
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('motivoColaborador', chartTitle, this.charts.motivoColaborador)
        };
    }

    getTaxaEmpresaChartOptions(chartTitle) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: chartTitle, font: { size: 18, weight: 'bold' } },
                legend: { position: 'top', labels: { font: { size: 14 } } },
                datalabels: {
                    display: true,
                    align: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value ? value.toFixed(2) + '%' : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Taxa (%)', font: { size: 14, weight: 'bold' } },
                    ticks: { callback: (value) => value.toFixed(2) + '%' }
                },
                x: { title: { display: true, text: 'Meses', font: { size: 14, weight: 'bold' } } }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('taxaEmpresa', chartTitle, this.charts.taxaEmpresa)
        };
    }

    getCargoEmpresaChartOptions(chartTitle, topCargos) {
        return this.getHorizontalBarChartOptions(chartTitle, topCargos, 'Quantidade de Demissões "Empresa"', 'Cargos', 'cargoEmpresa');
    }

    getTempoEmpresaChartOptions(chartTitle, categorias) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: chartTitle, 
                    font: { size: 18, weight: 'bold' } 
                },
                legend: { 
                    position: 'top', 
                    labels: { font: { size: 14 } } 
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            return categorias[context[0].dataIndex];
                        },
                        afterLabel: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            if (total > 0) {
                                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `${percentage}% do total do ano`;
                            }
                            return '';
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Quantidade de Demissões "Empresa"', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { stepSize: 1 }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Tempo de Casa', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { 
                        maxRotation: 45, 
                        minRotation: 45 
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('tempoEmpresa', chartTitle, this.charts.tempoEmpresa)
        };
    }

    getGeracaoEmpresaChartOptions(chartTitle, geracoes) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: chartTitle, 
                    font: { size: 18, weight: 'bold' } 
                },
                legend: { 
                    position: 'top', 
                    labels: { font: { size: 14 } } 
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            return geracoes[context[0].dataIndex];
                        },
                        afterLabel: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            if (total > 0) {
                                const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                                return `${percentage}% do total do ano`;
                            }
                            return '';
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Quantidade de Demissões "Empresa"', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { stepSize: 1 }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Faixa Etária', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { 
                        maxRotation: 45, 
                        minRotation: 45 
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('geracaoEmpresa', chartTitle, this.charts.geracaoEmpresa)
        };
    }

    getMotivoEmpresaChartOptions(chartTitle, motivos) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: { 
                    display: true, 
                    text: chartTitle, 
                    font: { size: 18, weight: 'bold' } 
                },
                legend: { 
                    position: 'top', 
                    labels: { font: { size: 14 } } 
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            const originalIndex = context[0].dataIndex;
                            return motivos[originalIndex] || context[0].label;
                        },
                        afterLabel: (context) => {
                            const originalIndex = context.dataIndex;
                            return `Motivo completo: ${motivos[originalIndex] || context.label}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end', // Centralizar dentro da barra
                    align: 'center',  // Alinhar no centro
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo branco semi-transparente
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000', // Texto preto para contraste
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Quantidade de Desligamentos "Empresa"', 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { stepSize: 1 }
                },
                y: {
                    title: { 
                        display: true, 
                        text: 'Motivo de Desligamento', 
                        font: { size: 14, weight: 'bold' } 
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart('motivoEmpresa', chartTitle, this.charts.motivoEmpresa)
        };
    }

    // Utility methods
    drawNoDataMessage(ctx, chartType) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#8B2635';
        const filterInfo = this.analyzer.currentFilter ? ` para "${this.analyzer.currentFilter}"` : '';
        ctx.fillText(`Nenhum dado disponível para ${chartType}${filterInfo}`, 50, 50);
    }

    addDownloadButton(canvasId, filename) {
        const chartCard = document.getElementById(canvasId).closest('.chart-card');
        const chartHeader = chartCard.querySelector('.chart-header');
        
        const existingButton = chartHeader.querySelector('.download-btn');
        if (existingButton) existingButton.remove();

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.title = 'Baixar gráfico';
        downloadBtn.onclick = (e) => {
            e.stopPropagation();
            this.downloadChart(canvasId, filename);
        };

        chartHeader.appendChild(downloadBtn);
    }

    downloadChart(canvasId, filename) {
        const canvas = document.getElementById(canvasId);
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        this.analyzer.showSuccess('Gráfico baixado com sucesso!');
    }

    expandChart(type, title, chartInstance) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <div class="modal-actions">
                        <button class="modal-download" onclick="turnoverAnalyzer.chartManager.downloadExpandedChart('${type}')">
                            <i class="fas fa-download"></i> Baixar
                        </button>
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                <div class="modal-body">
                    <canvas id="expanded-${type}-chart"></canvas>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => this.createExpandedChart(type, chartInstance), 100);
    }

    createExpandedChart(type, originalChart) {
        const ctx = document.getElementById(`expanded-${type}-chart`).getContext('2d');
        
        const originalConfig = originalChart.config;
        const config = {
            type: originalConfig.type,
            data: JSON.parse(JSON.stringify(originalConfig.data)),
            options: JSON.parse(JSON.stringify(originalConfig.options))
        };
        
        // Ajustar para modal
        if (config.options?.plugins?.title) {
            config.options.plugins.title.font = { size: 24, weight: 'bold' };
        }
        if (config.options?.plugins?.legend?.labels) {
            config.options.plugins.legend.labels.font = { size: 16 };
        }
        if (config.options?.plugins?.datalabels) {
            config.options.plugins.datalabels.font = { size: 14, weight: 'bold' };
            
            // Manter a formatação específica para gráficos de percentual
            if (type === 'turnover' || type === 'taxaColaborador' || type === 'taxaEmpresa') {
                config.options.plugins.datalabels.formatter = (value) => {
                    return value ? value.toFixed(2) + '%' : '';
                };
            }
        }
        
        // Remover onClick
        delete config.options?.onClick;
    
        this.charts.expanded = new Chart(ctx, {
            type: config.type,
            data: config.data,
            options: config.options,
            plugins: [ChartDataLabels]
        });
    }

    downloadExpandedChart(type) {
        const canvas = document.getElementById(`expanded-${type}-chart`);
        const link = document.createElement('a');
        link.download = `${type}-chart-expanded.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        this.analyzer.showSuccess('Gráfico expandido baixado com sucesso!');
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            this.destroyChart('expanded');
            modal.remove();
        }
    }

    getHorizontalBarChartOptions(chartTitle, items, xAxisTitle, yAxisTitle, chartType) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: { 
                    display: true, 
                    text: chartTitle, 
                    font: { size: 18, weight: 'bold' } 
                },
                legend: { 
                    position: 'top', 
                    labels: { font: { size: 14 } } 
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            const originalIndex = context[0].dataIndex;
                            return items[originalIndex] || context[0].label;
                        },
                        afterLabel: (context) => {
                            const originalIndex = context.dataIndex;
                            return `Cargo completo: ${items[originalIndex] || context.label}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000',
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: xAxisTitle, 
                        font: { size: 14, weight: 'bold' } 
                    },
                    ticks: { 
                        stepSize: 1,
                        // Garantir que todos os valores sejam mostrados
                        callback: function(value) {
                            return Number.isInteger(value) ? value : '';
                        }
                    },
                    // Adicionar margem extra para acomodar os datalabels
                    afterFit: function(scale) {
                        scale.paddingRight = 30;
                    },
                    // Configurar limites dinâmicos
                    min: 0,
                    // O max será calculado automaticamente pelo Chart.js
                    grace: '5%' // Adiciona 5% de espaço extra
                },
                y: {
                    title: { 
                        display: true, 
                        text: yAxisTitle, 
                        font: { size: 14, weight: 'bold' } 
                    }
                }
            },
            layout: {
                padding: {
                    right: 20 // Adicionar padding à direita para os datalabels
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart(chartType, chartTitle, this.charts[chartType])
        };
    }

    getVerticalBarChartOptions(chartTitle, items, yAxisTitle, xAxisTitle, chartType) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: chartTitle, font: { size: 18, weight: 'bold' } },
                legend: { position: 'top', labels: { font: { size: 14 } } },
                tooltip: {
                    callbacks: {
                        title: (context) => items[context[0].dataIndex],
                        afterLabel: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                            return `${percentage}% do total do ano`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 4,
                    font: { size: 11, weight: 'bold' },
                    color: '#000',
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: yAxisTitle, font: { size: 14, weight: 'bold' } },
                    ticks: { stepSize: 1 }
                },
                x: {
                    title: { display: true, text: xAxisTitle, font: { size: 14, weight: 'bold' } },
                    ticks: { maxRotation: 45, minRotation: 45 }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            onClick: () => this.expandChart(chartType, chartTitle, this.charts[chartType])
        };
    }
}
