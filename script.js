class TurnoverAnalyzer {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.summaryData = new Map();
        this.colaboradorData = new Map();
        this.empresaData = new Map();
        this.entities = new Set();
        this.currentFilter = '';
        
        // Inicializar módulos
        this.dataCalculator = new DataCalculator(this);
        this.chartManager = new ChartManager(this);
        this.pdfGenerator = new PDFGenerator(this); // Nova instância
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Botão principal do header
        document.getElementById('processFile').addEventListener('click', () => {
            this.processFile();
        });

        // Input do header
        document.getElementById('excelFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                document.getElementById('processFile').disabled = false;
                document.getElementById('processFile').style.opacity = '1';
            }
        });

        // Input da tela inicial
        document.getElementById('excelFileMain').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const headerInput = document.getElementById('excelFile');
                headerInput.files = e.target.files;
                this.processFile();
            }
        });

        // Filtros
        document.getElementById('applyFilter').addEventListener('click', () => {
            this.applyFilter();
        });

        document.getElementById('clearFilter').addEventListener('click', () => {
            this.clearFilter();
        });

        // Botão de exportar PDF
        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportToPDF();
        });

        // Inicialmente desabilitar os botões
        document.getElementById('processFile').disabled = true;
        document.getElementById('processFile').style.opacity = '0.5';

        // Event listeners para modais
        this.initializeModalListeners();
    }

    initializeModalListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
                this.chartManager.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.chartManager.closeModal();
            }
        });
    }

    async processFile() {
        const fileInput = document.getElementById('excelFile');
        const file = fileInput.files[0];

        if (!file) {
            this.showError('Por favor, selecione um arquivo Excel.');
            return;
        }

        this.showSuccess('Processando arquivo...');

        try {
            const data = await this.readExcelFile(file);
            
            if (data.length === 0) {
                this.showError('O arquivo Excel está vazio ou não contém dados válidos.');
                return;
            }

            const firstRow = data[0];
            if (!firstRow.hasOwnProperty('Mes') || !firstRow.hasOwnProperty('Ano') || !firstRow.hasOwnProperty('Status_2')) {
                this.showError('O arquivo não contém as colunas necessárias: Mes, Ano, Status_2');
                return;
            }

            this.data = data;
            this.filteredData = [...data];
            this.extractEntities();
            this.populateEntityFilter();
            this.dataCalculator.calculateSummary();
            this.dataCalculator.calculateColaboradorData();
            this.dataCalculator.calculateEmpresaData(); // Nova chamada
            
            if (this.summaryData.size === 0) {
                this.showError('Não foram encontrados dados válidos para processar.');
                return;
            }

            this.showDashboard();
            this.displayAllData();
            this.createAllCharts();
            this.showSuccess('Arquivo processado com sucesso!');
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            this.showError('Erro ao processar arquivo: ' + error.message);
        }
    }

    applyFilter() {
        const selectedEntity = document.getElementById('entityFilter').value;
        this.currentFilter = selectedEntity;
        
        if (selectedEntity === '') {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(row => {
                const entidade = row['ENTIDADE'];
                return entidade && String(entidade).trim() === selectedEntity;
            });
        }

        this.dataCalculator.calculateSummary();
        this.dataCalculator.calculateColaboradorData();
        this.dataCalculator.calculateEmpresaData(); // Nova chamada
        this.displayAllData();
        this.createAllCharts();
        
        const filterMessage = selectedEntity === '' ? 
            'Filtro removido - exibindo todas as entidades' : 
            `Filtro aplicado - exibindo apenas: ${selectedEntity}`;
        this.showSuccess(filterMessage);
    }

    clearFilter() {
        document.getElementById('entityFilter').value = '';
        this.applyFilter();
    }

    displayAllData() {
        this.displayTable();
        this.displayColaboradorTable();
        this.displayEmpresaTable(); // Nova chamada
        this.displaySummaryStats();
    }

    createAllCharts() {
        this.chartManager.createTurnoverChart();
        this.chartManager.createCargoChart();
        this.chartManager.createTempoChart();
        this.chartManager.createGeracaoChart();
        this.chartManager.createTipoDesligamentoChart();
        this.chartManager.createTaxaColaboradorChart();
        this.chartManager.createCargoColaboradorChart();
        this.chartManager.createTempoColaboradorChart(); // Nova chamada
        this.chartManager.createGeracaoColaboradorChart(); // Nova chamada
        this.chartManager.createMotivoColaboradorChart(); // Nova chamada
        // Novos gráficos para empresa
        this.chartManager.createTaxaEmpresaChart();
        this.chartManager.createCargoEmpresaChart();
        this.chartManager.createTempoEmpresaChart();
        this.chartManager.createGeracaoEmpresaChart();
        this.chartManager.createMotivoEmpresaChart();
    }

    // Data filtering methods
    filterDemissaoData() {
        return this.filteredData.filter(row => {
            const status = row['Status'];
            const cargo = row['Denominação de Cargo'];
            
            if (!status || !cargo) return false;
            
            const statusStr = String(status).toLowerCase().trim();
            return statusStr.includes('demis') || 
                   statusStr.includes('deslig') || 
                   statusStr.includes('rescis') ||
                   statusStr.includes('término') ||
                   statusStr.includes('termino');
        });
    }

    filterDemissaoColaboradorData() {
        return this.filteredData.filter(row => {
            const status = row['Status'];
            const tipoDesligamento = row['Tipo de desligamento'];
            const cargo = row['Denominação de Cargo'];
            
            if (!status || !tipoDesligamento || !cargo) return false;
            
            const statusStr = String(status).toLowerCase().trim();
            const tipoStr = String(tipoDesligamento).toLowerCase().trim();
            
            return (statusStr.includes('demis') || 
                    statusStr.includes('deslig') || 
                    statusStr.includes('rescis') ||
                    statusStr.includes('término') ||
                    statusStr.includes('termino')) && 
                   tipoStr.includes('colaborador');
        });
    }

    filterDemissaoEmpresaData() {
        return this.filteredData.filter(row => {
            const status = row['Status'];
            const tipoDesligamento = row['Tipo de desligamento'];
            const cargo = row['Denominação de Cargo'];
            
            if (!status || !tipoDesligamento || !cargo) return false;
            
            const statusStr = String(status).toLowerCase().trim();
            const tipoStr = String(tipoDesligamento).toLowerCase().trim();
            
            return (statusStr.includes('demis') || 
                    statusStr.includes('deslig') || 
                    statusStr.includes('rescis') ||
                    statusStr.includes('término') ||
                    statusStr.includes('termino')) && 
                   tipoStr.includes('empresa');
        });
    }

    filterDemissaoDataByField(fieldName) {
        return this.filteredData.filter(row => {
            const status = row['Status'];
            const field = row[fieldName];
            
            if (!status || !field) return false;
            
            const statusStr = String(status).toLowerCase().trim();
            return statusStr.includes('demis') || 
                   statusStr.includes('deslig') || 
                   statusStr.includes('rescis') ||
                   statusStr.includes('término') ||
                   statusStr.includes('termino');
        });
    }

    filterDemissaoColaboradorDataByField(fieldName) {
        return this.filteredData.filter(row => {
            const status = row['Status'];
            const tipoDesligamento = row['Tipo de desligamento'];
            const field = row[fieldName];
            
            if (!status || !tipoDesligamento || !field) return false;
            
            const statusStr = String(status).toLowerCase().trim();
            const tipoStr = String(tipoDesligamento).toLowerCase().trim();
            
            return (statusStr.includes('demis') || 
                    statusStr.includes('deslig') || 
                    statusStr.includes('rescis') ||
                    statusStr.includes('término') ||
                    statusStr.includes('termino')) && 
                   tipoStr.includes('colaborador');
        });
    }

    filterDemissaoEmpresaDataByField(fieldName) {
        return this.filteredData.filter(row => {
            const status = row['Status'];
            const tipoDesligamento = row['Tipo de desligamento'];
            const field = row[fieldName];
            
            if (!status || !tipoDesligamento || !field) return false;
            
            const statusStr = String(status).toLowerCase().trim();
            const tipoStr = String(tipoDesligamento).toLowerCase().trim();
            
            return (statusStr.includes('demis') || 
                    statusStr.includes('deslig') || 
                    statusStr.includes('rescis') ||
                    statusStr.includes('término') ||
                    statusStr.includes('termino')) && 
                   tipoStr.includes('empresa');
        });
    }

    // Utility methods
    getChartTitle(baseTitle) {
        return this.currentFilter ? `${baseTitle} - ${this.currentFilter}` : baseTitle;
    }

    showDashboard() {
        document.getElementById('initial-state').style.display = 'none';
        document.getElementById('filters').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'flex';
        
        // Habilitar botão de export PDF
        document.getElementById('exportPDF').disabled = false;
        document.getElementById('exportPDF').style.opacity = '1';
    }

    extractEntities() {
        this.entities.clear();
        this.data.forEach(row => {
            const entidade = row['ENTIDADE'];
            if (entidade && String(entidade).trim() !== '') {
                this.entities.add(String(entidade).trim());
            }
        });
    }

    populateEntityFilter() {
        const select = document.getElementById('entityFilter');
        select.innerHTML = '<option value="">Todas as Entidades</option>';
        
        const sortedEntities = Array.from(this.entities).sort();
        sortedEntities.forEach(entity => {
            const option = document.createElement('option');
            option.value = entity;
            option.textContent = entity;
            select.appendChild(option);
        });
    }

    readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                        header: 1,
                        defval: '',
                        blankrows: false
                    });

                    if (jsonData.length < 2) {
                        reject(new Error('O arquivo não contém dados suficientes'));
                        return;
                    }

                    const headers = jsonData[0];
                    const processedData = [];
                    
                    for (let i = 1; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (row.length === 0) continue;
                        
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = row[index] || '';
                        });
                        
                        if (obj['Mes'] || obj['Ano'] || obj['Status_2']) {
                            processedData.push(obj);
                        }
                    }

                    resolve(processedData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsArrayBuffer(file);
        });
    }

    displayTable() {
        const container = document.getElementById('tableContainer');
        
        if (this.summaryData.size === 0) {
            const filterInfo = this.currentFilter ? ` para a entidade "${this.currentFilter}"` : '';
            container.innerHTML = `<p>Nenhum dado encontrado para exibir${filterInfo}.</p>`;
            return;
        }

        const sortedData = Array.from(this.summaryData.entries())
            .sort((a, b) => {
                const [keyA, dataA] = a;
                const [keyB, dataB] = b;
                
                if (dataA.ano !== dataB.ano) {
                    return dataA.ano - dataB.ano;
                }
                
                return dataA.mes - dataB.mes;
            });

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Ano</th>
                        <th>Mês</th>
                        <th>Ativo</th>
                        <th>Ativo mês</th>
                        <th>Desligado mês</th>
                        <th>Desligado</th>
                        <th>Turnover (%)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sortedData.forEach(([key, data]) => {
            tableHTML += `
                <tr>
                    <td>${data.ano}</td>
                    <td>${data.mes}</td>
                    <td>${data.Ativo}</td>
                    <td>${data.AtivoMes}</td>
                    <td>${data.DesligadoMes}</td>
                    <td>${data.Desligado}</td>
                    <td class="turnover-cell">${data.turnover.toFixed(2)}%</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;

        if (this.currentFilter) {
            tableHTML = `<p class="filter-info"><strong>Filtro ativo:</strong> ${this.currentFilter}</p>` + tableHTML;
        }

        container.innerHTML = tableHTML;
    }

    displayColaboradorTable() {
        const container = document.getElementById('colaboradorTableContainer');
        
        if (this.colaboradorData.size === 0) {
            const filterInfo = this.currentFilter ? ` para a entidade "${this.currentFilter}"` : '';
            container.innerHTML = `<p>Nenhum dado de colaborador encontrado${filterInfo}.</p>`;
            return;
        }

        const sortedData = Array.from(this.colaboradorData.entries())
            .sort((a, b) => {
                const [keyA, dataA] = a;
                const [keyB, dataB] = b;
                
                if (dataA.ano !== dataB.ano) {
                    return dataA.ano - dataB.ano;
                }
                
                return dataA.mes - dataB.mes;
            });

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Ano</th>
                        <th>Mês</th>
                        <th>Total Ativos</th>
                        <th>Desligados "Colaborador"</th>
                        <th>Taxa (%)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sortedData.forEach(([key, data]) => {
            tableHTML += `
                <tr>
                    <td>${data.ano}</td>
                    <td>${data.mes}</td>
                    <td>${data.ativosTotal}</td>
                    <td>${data.desligadosColaborador}</td>
                    <td class="turnover-cell">${data.taxa.toFixed(2)}%</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;

        if (this.currentFilter) {
            tableHTML = `<p class="filter-info"><strong>Filtro ativo:</strong> ${this.currentFilter}</p>` + tableHTML;
        }

        container.innerHTML = tableHTML;
    }

    displayEmpresaTable() {
        const container = document.getElementById('empresaTableContainer');
        
        if (this.empresaData.size === 0) {
            const filterInfo = this.currentFilter ? ` para a entidade "${this.currentFilter}"` : '';
            container.innerHTML = `<p>Nenhum dado de empresa encontrado${filterInfo}.</p>`;
            return;
        }

        const sortedData = Array.from(this.empresaData.entries())
            .sort((a, b) => {
                const [keyA, dataA] = a;
                const [keyB, dataB] = b;
                
                if (dataA.ano !== dataB.ano) {
                    return dataA.ano - dataB.ano;
                }
                
                return dataA.mes - dataB.mes;
            });

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Ano</th>
                        <th>Mês</th>
                        <th>Total Ativos</th>
                        <th>Desligados "Empresa"</th>
                        <th>Taxa (%)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sortedData.forEach(([key, data]) => {
            tableHTML += `
                <tr>
                    <td>${data.ano}</td>
                    <td>${data.mes}</td>
                    <td>${data.ativosTotal}</td>
                    <td>${data.desligadosEmpresa}</td>
                    <td class="turnover-cell">${data.taxa.toFixed(2)}%</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;

        if (this.currentFilter) {
            tableHTML = `<p class="filter-info"><strong>Filtro ativo:</strong> ${this.currentFilter}</p>` + tableHTML;
        }

        container.innerHTML = tableHTML;
    }

    displaySummaryStats() {
        const container = document.getElementById('summaryStats');
        
        if (this.summaryData.size === 0) {
            container.innerHTML = '';
            return;
        }

        const statsByYear = new Map();
        
        this.summaryData.forEach((data, key) => {
            const year = data.ano;
            if (!statsByYear.has(year)) {
                statsByYear.set(year, {
                    turnoverSum: 0,
                    ativosSum: 0,
                    count: 0
                });
            }
            
            const yearStats = statsByYear.get(year);
            yearStats.turnoverSum += data.turnover;
            yearStats.ativosSum += data.Ativo;
            yearStats.count++;
        });

        let statsHTML = '';

        if (this.currentFilter) {
            statsHTML += `<div class="filter-info"><strong>Dados para:</strong> ${this.currentFilter}</div>`;
        }

        const sortedYears = Array.from(statsByYear.keys()).sort((a, b) => a - b);

        sortedYears.forEach(year => {
            const stats = statsByYear.get(year);
            const avgAtivos = stats.count > 0 ? (stats.ativosSum / stats.count) : 0;
            
            statsHTML += `
                <div class="kpi-card">
                    <div class="kpi-year">${year}</div>
                    <div class="kpi-item">
                        <span class="kpi-label">TO Acumulado:</span>
                        <span class="kpi-value">${stats.turnoverSum.toFixed(2)}%</span>
                    </div>
                    <div class="kpi-item">
                        <span class="kpi-label">Média de Ativos:</span>
                        <span class="kpi-value">${avgAtivos.toFixed(0)}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = statsHTML;
    }

    async exportToPDF() {
        if (this.summaryData.size === 0) {
            this.showError('Nenhum dado disponível para exportar. Processe um arquivo primeiro.');
            return;
        }

        // Adicionar classe loading ao botão
        const exportBtn = document.getElementById('exportPDF');
        exportBtn.classList.add('loading');
        exportBtn.disabled = true;

        try {
            await this.pdfGenerator.generateFullReport();
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            this.showError('Erro ao exportar relatório PDF: ' + error.message);
        } finally {
            // Remover classe loading
            exportBtn.classList.remove('loading');
            exportBtn.disabled = false;
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
        console.error(message);
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.error, .success');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }
}

// Declaração global da variável
let turnoverAnalyzer;

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    turnoverAnalyzer = new TurnoverAnalyzer();
});