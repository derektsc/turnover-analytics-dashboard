class PDFGenerator {
    constructor(analyzer) {
        this.analyzer = analyzer;
        this.pdf = null;
        this.currentY = 0;
        this.pageHeight = 297; // A4 height in mm
        this.margin = 20;
        this.maxContentHeight = this.pageHeight - (this.margin * 2);
        this.jsPDFLoaded = false;
    }

    async loadJsPDF() {
        if (this.jsPDFLoaded || window.jspdf) {
            return true;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                this.jsPDFLoaded = true;
                resolve(true);
            };
            script.onerror = () => {
                reject(new Error('Falha ao carregar biblioteca PDF'));
            };
            document.head.appendChild(script);
        });
    }

    async generateFullReport() {
        try {
            this.analyzer.showSuccess('Gerando relatório PDF...');
            
            // Carregar jsPDF se necessário
            await this.loadJsPDF();
            
            // Verificar diferentes formas de acessar o jsPDF
            let jsPDFConstructor = null;
            
            if (window.jspdf && window.jspdf.jsPDF) {
                jsPDFConstructor = window.jspdf.jsPDF;
            } else if (window.jsPDF) {
                jsPDFConstructor = window.jsPDF;
            } else if (window.jspdf) {
                jsPDFConstructor = window.jspdf;
            }
            
            if (!jsPDFConstructor) {
                throw new Error('Não foi possível acessar o construtor jsPDF');
            }
            
            
            // Criar instância do PDF
            this.pdf = new jsPDFConstructor('p', 'mm', 'a4');
            this.currentY = this.margin;

            // Página de capa
            await this.createCoverPage();

            // Sumário executivo
            await this.createExecutiveSummary();

            // Dados principais
            await this.createMainDataSection();

            // Gráficos principais
            await this.createMainChartsSection();

            // Análises complementares
            await this.createComplementaryAnalysisSection();

            // Rodapé final
            this.addFooter(true);

            // Salvar PDF
            const filterSuffix = this.analyzer.currentFilter ? `_${this.analyzer.currentFilter.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
            const timestamp = new Date().toISOString().slice(0, 10);
            this.pdf.save(`Relatorio_Turnover_${timestamp}${filterSuffix}.pdf`);
            
            this.analyzer.showSuccess('Relatório PDF gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            this.analyzer.showError('Erro ao gerar relatório PDF: ' + error.message);
        }
    }

    async createCoverPage() {
        // Logo/Título
        this.pdf.setFontSize(24);
        this.pdf.setTextColor(139, 38, 53); // #8B2635
        this.pdf.text('RELATÓRIO DE ANÁLISE', 105, 60, { align: 'center' });
        this.pdf.text('DE TURNOVER', 105, 75, { align: 'center' });

        // Subtítulo
        this.pdf.setFontSize(16);
        this.pdf.setTextColor(218, 98, 125); // #DA627D
        this.pdf.text('Dashboard Interativo de RH', 105, 95, { align: 'center' });

        // Informações do relatório
        this.pdf.setFontSize(12);
        this.pdf.setTextColor(0, 0, 0);
        
        const today = new Date().toLocaleDateString('pt-BR');
        const filterInfo = this.analyzer.currentFilter ? 
            `Entidade: ${this.analyzer.currentFilter}` : 
            'Todas as Entidades';

        this.pdf.text(`Data de Geração: ${today}`, 105, 130, { align: 'center' });
        this.pdf.text(filterInfo, 105, 145, { align: 'center' });

        // Período dos dados
        const years = Array.from(this.analyzer.summaryData.values())
            .map(data => data.ano)
            .filter((year, index, arr) => arr.indexOf(year) === index)
            .sort((a, b) => a - b);
        
        if (years.length > 0) {
            const periodText = years.length === 1 ? 
                `Período: ${years[0]}` : 
                `Período: ${years[0]} - ${years[years.length - 1]}`;
            this.pdf.text(periodText, 105, 160, { align: 'center' });
        }

        // Linha decorativa
        this.pdf.setDrawColor(218, 98, 125);
        this.pdf.setLineWidth(2);
        this.pdf.line(50, 180, 160, 180);

        // Rodapé da capa
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(150, 150, 150);
        this.pdf.text('Gerado por Dashboard de Análise de Turnover', 105, 250, { align: 'center' });
        this.pdf.text('Processamento 100% Local - Dados Confidenciais', 105, 260, { align: 'center' });

        this.addNewPage();
    }

    async createExecutiveSummary() {
        this.addSectionTitle('SUMÁRIO EXECUTIVO');

        // KPIs principais
        const statsByYear = this.calculateYearlyStats();
        
        this.pdf.setFontSize(12);
        this.pdf.setTextColor(0, 0, 0);
        
        let y = this.currentY + 10;
        
        // Cabeçalho da tabela de KPIs
        this.pdf.setFillColor(218, 98, 125);
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.rect(this.margin, y, 170, 8, 'F');
        this.pdf.text('ANO', this.margin + 5, y + 6);
        this.pdf.text('TO ACUMULADO (%)', this.margin + 40, y + 6);
        this.pdf.text('MÉDIA ATIVOS', this.margin + 90, y + 6);
        this.pdf.text('TOTAL DEMISSÕES', this.margin + 130, y + 6);

        y += 8;

        // Dados dos KPIs
        this.pdf.setTextColor(0, 0, 0);
        const sortedYears = Array.from(statsByYear.keys()).sort((a, b) => a - b);
        
        sortedYears.forEach((year, index) => {
            const stats = statsByYear.get(year);
            const fillColor = index % 2 === 0 ? [248, 248, 248] : [255, 255, 255];
            
            this.pdf.setFillColor(...fillColor);
            this.pdf.rect(this.margin, y, 170, 6, 'F');
            
            this.pdf.text(year.toString(), this.margin + 5, y + 4);
            this.pdf.text(stats.turnoverSum.toFixed(2) + '%', this.margin + 40, y + 4);
            this.pdf.text(stats.avgAtivos.toFixed(0), this.margin + 90, y + 4);
            this.pdf.text(stats.totalDemissoes.toString(), this.margin + 130, y + 4);
            
            y += 6;
        });

        this.currentY = y + 15;

        // Insights principais
        this.addSubtitle('Principais Insights');
        
        const insights = this.generateInsights(statsByYear);
        this.pdf.setFontSize(11);
        
        insights.forEach(insight => {
            // Quebrar linha se muito longa
            const maxWidth = 170;
            const lines = this.pdf.splitTextToSize(`• ${insight}`, maxWidth);
            
            lines.forEach(line => {
                if (this.currentY > this.maxContentHeight + this.margin - 10) {
                    this.addNewPage();
                }
                this.pdf.text(line, this.margin + 5, this.currentY);
                this.currentY += 6;
            });
        });

        this.currentY += 10;
    }

    async createMainDataSection() {
        this.addSectionTitle('DADOS PRINCIPAIS');

        // Tabela de dados mensais
        await this.createDataTable();
        
        if (this.analyzer.colaboradorData.size > 0) {
            this.addSubtitle('Dados - Taxa Colaborador');
            await this.createColaboradorTable();
        }

        if (this.analyzer.empresaData.size > 0) {
            this.addSubtitle('Dados - Taxa Empresa');
            await this.createEmpresaTable();
        }
    }

    async createMainChartsSection() {
        this.addSectionTitle('ANÁLISES VISUAIS - PRINCIPAIS');

        // Capturar e adicionar gráficos principais
        const mainCharts = [
            { id: 'turnoverChart', title: 'Evolução do Turnover' },
            { id: 'cargoChart', title: 'Demissões por Cargo' },
            { id: 'tempoChart', title: 'Demissões por Tempo de Casa' },
            { id: 'geracaoChart', title: 'Demissões por Geração' },
            { id: 'tipoDesligamentoChart', title: 'Tipos de Desligamento' }
        ];

        for (const chart of mainCharts) {
            await this.addChartToPDF(chart.id, chart.title);
        }
    }

    async createComplementaryAnalysisSection() {
        this.addSectionTitle('ANÁLISES COMPLEMENTARES');

        const complementaryCharts = [
            { id: 'taxaColaboradorChart', title: 'Taxa de Desligamento - Colaborador' },
            { id: 'cargoColaboradorChart', title: 'TOP 10 Demissões "Colaborador" por Cargo' },
            { id: 'tempoColaboradorChart', title: 'Tempo de Casa - Demissões "Colaborador"' },
            { id: 'geracaoColaboradorChart', title: 'Demissões "Colaborador" por Geração' },
            { id: 'motivoColaboradorChart', title: 'Motivos - "Colaborador"' },
            { id: 'taxaEmpresaChart', title: 'Taxa de Desligamento - Empresa' },
            { id: 'cargoEmpresaChart', title: 'TOP 10 Demissões "Empresa" por Cargo' },
            { id: 'tempoEmpresaChart', title: 'Tempo de Casa - Demissões "Empresa"' },
            { id: 'geracaoEmpresaChart', title: 'Demissões "Empresa" por Geração' },
            { id: 'motivoEmpresaChart', title: 'Motivos - "Empresa"' }
        ];

        for (const chart of complementaryCharts) {
            const canvas = document.getElementById(chart.id);
            if (canvas && this.hasValidChart(canvas)) {
                await this.addChartToPDF(chart.id, chart.title);
            }
        }
    }

    async addChartToPDF(chartId, title) {
        const canvas = document.getElementById(chartId);
        if (!canvas || !this.hasValidChart(canvas)) {
            return;
        }

        try {
            // Verificar espaço disponível
            const chartHeight = 120;
            const titleHeight = 15;
            const totalHeight = chartHeight + titleHeight;

            if (this.currentY + totalHeight > this.maxContentHeight + this.margin) {
                this.addNewPage();
            }

            // Adicionar título do gráfico
            this.pdf.setFontSize(14);
            this.pdf.setTextColor(139, 38, 53);
            this.pdf.text(title, this.margin, this.currentY);
            this.currentY += titleHeight;

            // Capturar imagem do canvas
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Adicionar imagem ao PDF
            const imgWidth = 170;
            const imgHeight = (canvas.height / canvas.width) * imgWidth;
            const finalHeight = Math.min(imgHeight, chartHeight);

            this.pdf.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, finalHeight);
            this.currentY += finalHeight + 10;
        } catch (error) {
            console.warn(`Erro ao adicionar gráfico ${chartId}:`, error);
            // Continuar sem o gráfico
            this.pdf.setFontSize(12);
            this.pdf.setTextColor(150, 150, 150);
            this.pdf.text(`Gráfico não disponível: ${title}`, this.margin, this.currentY);
            this.currentY += 20;
        }
    }

    async createDataTable() {
        if (this.analyzer.summaryData.size === 0) return;

        this.addSubtitle('Dados Mensais de Turnover');

        const sortedData = Array.from(this.analyzer.summaryData.entries())
            .sort((a, b) => {
                const [keyA, dataA] = a;
                const [keyB, dataB] = b;
                
                if (dataA.ano !== dataB.ano) {
                    return dataA.ano - dataB.ano;
                }
                
                return dataA.mes - dataB.mes;
            });

        // Cabeçalho da tabela
        this.pdf.setFillColor(218, 98, 125);
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(9);

        const colWidths = [20, 20, 25, 25, 30, 25, 25];
        const headers = ['Ano', 'Mês', 'Ativo', 'Ativo mês', 'Desligado mês', 'Desligado', 'TO (%)'];
        
        let x = this.margin;
        this.pdf.rect(x, this.currentY, colWidths.reduce((a, b) => a + b), 6, 'F');
        
        headers.forEach((header, i) => {
            this.pdf.text(header, x + colWidths[i]/2, this.currentY + 4, { align: 'center' });
            x += colWidths[i];
        });

        this.currentY += 6;

        // Dados da tabela
        this.pdf.setTextColor(0, 0, 0);
        
        sortedData.forEach((row, index) => {
            const [key, data] = row;
            
            if (this.currentY > this.maxContentHeight + this.margin - 10) {
                this.addNewPage();
            }

            const fillColor = index % 2 === 0 ? [248, 248, 248] : [255, 255, 255];
            this.pdf.setFillColor(...fillColor);
            
            x = this.margin;
            this.pdf.rect(x, this.currentY, colWidths.reduce((a, b) => a + b), 5, 'F');

            const values = [
                data.ano.toString(),
                data.mes.toString(),
                data.Ativo.toString(),
                data.AtivoMes.toString(),
                data.DesligadoMes.toString(),
                data.Desligado.toString(),
                data.turnover.toFixed(2) + '%'
            ];

            values.forEach((value, i) => {
                this.pdf.text(value, x + colWidths[i]/2, this.currentY + 3.5, { align: 'center' });
                x += colWidths[i];
            });

            this.currentY += 5;
        });

        this.currentY += 10;
    }

    async createColaboradorTable() {
        if (this.analyzer.colaboradorData.size === 0) return;

        const sortedData = Array.from(this.analyzer.colaboradorData.entries())
            .sort((a, b) => {
                const [keyA, dataA] = a;
                const [keyB, dataB] = b;
                
                if (dataA.ano !== dataB.ano) {
                    return dataA.ano - dataB.ano;
                }
                
                return dataA.mes - dataB.mes;
            });

        // Cabeçalho
        this.pdf.setFillColor(218, 98, 125);
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(9);

        const colWidths = [25, 25, 40, 50, 30];
        const headers = ['Ano', 'Mês', 'Total Ativos', 'Desligados "Colaborador"', 'Taxa (%)'];
        
        let x = this.margin;
        this.pdf.rect(x, this.currentY, colWidths.reduce((a, b) => a + b), 6, 'F');
        
        headers.forEach((header, i) => {
            this.pdf.text(header, x + colWidths[i]/2, this.currentY + 4, { align: 'center' });
            x += colWidths[i];
        });

        this.currentY += 6;

        // Dados
        this.pdf.setTextColor(0, 0, 0);
        
        sortedData.forEach((row, index) => {
            const [key, data] = row;
            
            if (this.currentY > this.maxContentHeight + this.margin - 10) {
                this.addNewPage();
            }

            const fillColor = index % 2 === 0 ? [248, 248, 248] : [255, 255, 255];
            this.pdf.setFillColor(...fillColor);
            
            x = this.margin;
            this.pdf.rect(x, this.currentY, colWidths.reduce((a, b) => a + b), 5, 'F');

            const values = [
                data.ano.toString(),
                data.mes.toString(),
                data.ativosTotal.toString(),
                data.desligadosColaborador.toString(),
                data.taxa.toFixed(2) + '%'
            ];

            values.forEach((value, i) => {
                this.pdf.text(value, x + colWidths[i]/2, this.currentY + 3.5, { align: 'center' });
                x += colWidths[i];
            });

            this.currentY += 5;
        });

        this.currentY += 10;
    }

    async createEmpresaTable() {
        if (this.analyzer.empresaData.size === 0) return;

        const sortedData = Array.from(this.analyzer.empresaData.entries())
            .sort((a, b) => {
                const [keyA, dataA] = a;
                const [keyB, dataB] = b;
                
                if (dataA.ano !== dataB.ano) {
                    return dataA.ano - dataB.ano;
                }
                
                return dataA.mes - dataB.mes;
            });

        // Cabeçalho
        this.pdf.setFillColor(218, 98, 125);
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(9);

        const colWidths = [25, 25, 40, 50, 30];
        const headers = ['Ano', 'Mês', 'Total Ativos', 'Desligados "Empresa"', 'Taxa (%)'];
        
        let x = this.margin;
        this.pdf.rect(x, this.currentY, colWidths.reduce((a, b) => a + b), 6, 'F');
        
        headers.forEach((header, i) => {
            this.pdf.text(header, x + colWidths[i]/2, this.currentY + 4, { align: 'center' });
            x += colWidths[i];
        });

        this.currentY += 6;

        // Dados
        this.pdf.setTextColor(0, 0, 0);
        
        sortedData.forEach((row, index) => {
            const [key, data] = row;
            
            if (this.currentY > this.maxContentHeight + this.margin - 10) {
                this.addNewPage();
            }

            const fillColor = index % 2 === 0 ? [248, 248, 248] : [255, 255, 255];
            this.pdf.setFillColor(...fillColor);
            
            x = this.margin;
            this.pdf.rect(x, this.currentY, colWidths.reduce((a, b) => a + b), 5, 'F');

            const values = [
                data.ano.toString(),
                data.mes.toString(),
                data.ativosTotal.toString(),
                data.desligadosEmpresa.toString(),
                data.taxa.toFixed(2) + '%'
            ];

            values.forEach((value, i) => {
                this.pdf.text(value, x + colWidths[i]/2, this.currentY + 3.5, { align: 'center' });
                x += colWidths[i];
            });

            this.currentY += 5;
        });

        this.currentY += 10;
    }

    // Utility methods
    addNewPage() {
        this.pdf.addPage();
        this.addHeader();
        this.currentY = this.margin + 15;
    }

    addHeader() {
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(150, 150, 150);
        this.pdf.text('Relatório de Turnover', this.margin, 10);
        
        const pageNum = this.pdf.internal.getNumberOfPages();
        this.pdf.text(`Página ${pageNum}`, 190, 10, { align: 'right' });
        
        this.pdf.setDrawColor(200, 200, 200);
        this.pdf.line(this.margin, 12, 190, 12);
    }

    addFooter(isLastPage = false) {
        const pageHeight = this.pdf.internal.pageSize.height;
        
        this.pdf.setDrawColor(200, 200, 200);
        this.pdf.line(this.margin, pageHeight - 20, 190, pageHeight - 20);
        
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(100, 100, 100);
        
        if (isLastPage) {
            this.pdf.text('Relatório gerado automaticamente pelo Dashboard de Análise de Turnover', 105, pageHeight - 15, { align: 'center' });
            this.pdf.text('Dados processados localmente - Informações confidenciais', 105, pageHeight - 10, { align: 'center' });
        } else {
            this.pdf.text(new Date().toLocaleDateString('pt-BR'), 105, pageHeight - 10, { align: 'center' });
        }
    }

    addSectionTitle(title) {
        if (this.currentY > this.maxContentHeight + this.margin - 30) {
            this.addNewPage();
        }

        this.pdf.setFontSize(16);
        this.pdf.setTextColor(139, 38, 53);
        this.pdf.text(title, this.margin, this.currentY);
        
        this.pdf.setDrawColor(218, 98, 125);
        this.pdf.setLineWidth(1);
        this.pdf.line(this.margin, this.currentY + 2, 190, this.currentY + 2);
        
        this.currentY += 15;
    }

    addSubtitle(subtitle) {
        if (this.currentY > this.maxContentHeight + this.margin - 20) {
            this.addNewPage();
        }

        this.pdf.setFontSize(12);
        this.pdf.setTextColor(218, 98, 125);
        this.pdf.text(subtitle, this.margin, this.currentY);
        this.currentY += 10;
    }

    calculateYearlyStats() {
        const statsByYear = new Map();
        
        this.analyzer.summaryData.forEach((data, key) => {
            const year = data.ano;
            if (!statsByYear.has(year)) {
                statsByYear.set(year, {
                    turnoverSum: 0,
                    ativosSum: 0,
                    count: 0,
                    totalDemissoes: 0
                });
            }
            
            const yearStats = statsByYear.get(year);
            yearStats.turnoverSum += data.turnover;
            yearStats.ativosSum += data.Ativo;
            yearStats.totalDemissoes += data.DesligadoMes;
            yearStats.count++;
        });

        // Calcular médias
        statsByYear.forEach((stats, year) => {
            stats.avgAtivos = stats.count > 0 ? (stats.ativosSum / stats.count) : 0;
        });

        return statsByYear;
    }

    generateInsights(statsByYear) {
        const insights = [];
        const years = Array.from(statsByYear.keys()).sort((a, b) => a - b);
        
        if (years.length === 1) {
            const year = years[0];
            const stats = statsByYear.get(year);
            insights.push(`Análise realizada para o ano de ${year}`);
            insights.push(`Turnover acumulado de ${stats.turnoverSum.toFixed(2)}% no período`);
            insights.push(`Média de ${stats.avgAtivos.toFixed(0)} colaboradores ativos por mês`);
            insights.push(`Total de ${stats.totalDemissoes} desligamentos no ano`);
        } else if (years.length > 1) {
            const firstYear = years[0];
            const lastYear = years[years.length - 1];
            const firstStats = statsByYear.get(firstYear);
            const lastStats = statsByYear.get(lastYear);
            
            insights.push(`Análise comparativa entre ${firstYear} e ${lastYear}`);
            
            const turnoverDiff = lastStats.turnoverSum - firstStats.turnoverSum;
            if (turnoverDiff > 0) {
                insights.push(`Aumento de ${turnoverDiff.toFixed(2)}% no turnover acumulado`);
            } else {
                insights.push(`Redução de ${Math.abs(turnoverDiff).toFixed(2)}% no turnover acumulado`);
            }

            const ativosDiff = lastStats.avgAtivos - firstStats.avgAtivos;
            if (ativosDiff > 0) {
                insights.push(`Crescimento médio de ${ativosDiff.toFixed(0)} colaboradores ativos`);
            } else {
                insights.push(`Redução média de ${Math.abs(ativosDiff).toFixed(0)} colaboradores ativos`);
            }
        }

        if (this.analyzer.currentFilter) {
            insights.push(`Dados filtrados para a entidade: ${this.analyzer.currentFilter}`);
        } else {
            insights.push('Análise contempla todas as entidades disponíveis');
        }

        return insights;
    }

    hasValidChart(canvas) {
        if (!canvas) return false;
        
        try {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Verificar se há conteúdo não-branco no canvas
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                const a = imageData.data[i + 3];
                
                if (a > 0 && (r < 250 || g < 250 || b < 250)) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.warn('Erro ao validar canvas:', error);
            return false;
        }
    }
}
