# 📊 Dashboard de Análise de Turnover

Um sistema completo e **100% seguro** para análise de turnover de RH, com processamento totalmente local (client-side) e dashboards interativos.

## 🚀 **Demo ao Vivo**

👉 **[Acesse a Aplicação](https://derektsc.github.io/turnover-analytics-dashboard/)**

![Dashboard Preview](![image](https://github.com/user-attachments/assets/fa6206ce-80e5-4425-9258-a9e9fbff5bb0)
)

## ✨ **Principais Características**

### 🔒 **100% Seguro**
- **Zero transmissão de dados** - tudo processa no seu navegador
- **Tecnologia client-side** - HTML/CSS/JavaScript puro
- **Sem servidores** - dados nunca saem do computador
- **Código auditável** - open source completo

### 📈 **19 Visualizações + Export PDF**
- **Evolução do Turnover** por mês/ano
- **TOP 10 Cargos** com mais demissões
- **Análise por Tempo de Casa** e faixa etária
- **Segmentação por Tipo** ("Colaborador" vs "Empresa")
- **Filtros por Entidade** (matriz, filiais, regionais)
- **KPIs Executivos** automatizados
- **🆕 Relatório PDF completo** com todos os dados e gráficos

### 🎯 **Interface Moderna**
- **Design responsivo** (desktop + mobile)
- **Gráficos interativos** com drill-down
- **Modal expandido** para análise detalhada
- **Download de gráficos** em alta qualidade
- **Export PDF automático** com capa, sumário e insights
- **Cores corporativas** profissionais

## 📋 **Como Usar**

### 1. **Prepare sua Planilha Excel**
Sua planilha precisa ter as colunas abaixo para gerar o dashboard **(O nome das colunas precisam ser exatamente dessa forma)**:
- `Mes` (ex: "JAN", "DEZ")
- `Ano` (ex: 2024)
- `Status_2` (ex: "Ativo", "Ativo mês", "Desligado mês", "Desligado")
- `Status` (ex: "Desligado", "Ativo")
- `ENTIDADE` (ex: "Tucuruvi", "Jabaquara", "Belém", "Vila Madalena")
- `Denominação de Cargo` (ex: "Analista, Gerente")
- `Tempo de casa` (ex: "1 a 3 anos", "5 a 10 anos")
- `Range-Idade` (ex: 25-30, 31-40, 41-50)
- `Tipo de desligamento` (ex: "Empresa", "Colaborador")
- `Motivo desligamento` (ex: "Layoff", "Pedido de demissão")

### 2. **Faça Upload**
- Arraste o arquivo `.xlsx` ou clique para selecionar
- O sistema valida automaticamente a estrutura
- Processamento acontece instantaneamente

### 3. **Analise os Resultados**
- **KPIs** aparecem no topo
- **Gráficos interativos** em cards organizados
- **Filtros por entidade** no cabeçalho
- **Tabelas detalhadas** com dados base
- **🆕 Export PDF** com relatório executivo completo

## 🆕 **Novo: Relatório PDF Automatizado**

### **📄 O que inclui:**
- **Capa profissional** com informações do relatório
- **Sumário executivo** com KPIs principais e insights
- **Dados detalhados** em tabelas organizadas
- **Todos os gráficos** em alta qualidade
- **Análises complementares** completas
- **Formatação corporativa** padronizada

### **🎯 Como usar:**
1. Processe sua planilha normalmente
2. Clique no botão **"Exportar PDF"** no cabeçalho
3. Aguarde a geração (alguns segundos)
4. PDF é baixado automaticamente

### **📊 Conteúdo do PDF:**
- Página de capa com período e filtros aplicados
- KPIs anuais consolidados
- Insights automáticos baseados nos dados
- Tabelas de dados mensais
- Todos os gráficos principais e complementares
- Formatação profissional para apresentações

## 🎨 **Preview das Visualizações**

<details>
<summary><strong>📈 Análise Principal (7 visualizações)</strong></summary>

1. **Evolução do Turnover** - Linha temporal mensal
2. **Demissões por Cargo** - TOP 10 cargos
3. **Demissões por Tempo de Casa** - Distribuição por senioridade
4. **Demissões por Geração** - Análise demográfica
5. **Tipos de Desligamento** - Distribuição geral
6. **Dados Detalhados** - Tabela com totais mensais
7. **KPIs Anuais** - TO acumulado e média de ativos

</details>

<details>
<summary><strong>🔍 Análises Complementares (12 visualizações)</strong></summary>

**Para Desligamentos "Colaborador":**
- Taxa de Desligamento temporal
- TOP 10 Cargos específicos
- Tempo de Casa segmentado
- Análise por Geração
- Motivos detalhados

**Para Desligamentos "Empresa":**
- Taxa de Desligamento temporal  
- TOP 10 Cargos específicos
- Tempo de Casa segmentado
- Análise por Geração
- Motivos detalhados

</details>

## 📊 **Estrutura da Planilha**

### **Colunas Obrigatórias**
```excel
Mes | Ano | Status_2
----|-----|----------
JAN   | 2024| Ativo
JAN   | 2024| Ativo mês
JAN   | 2024| Desligado mês
```

### **Colunas Opcionais (para gráficos avançados)**
```excel
ENTIDADE | Status | Denominação de Cargo | Tempo de casa | Range-Idade | Tipo de desligamento | Motivo desligamento
---------|--------|---------------------|---------------|-------------|----------------------|--------------------
Matriz   | Ativo  | Analista           | 1 a 3 anos    | 25-30       | -                    | -
Filial   | Demissão| Coordenador       | 2 a 5 anos    | 30-35       | Colaborador          | Pedido de demissão
```

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **HTML5** + **CSS3** - Estrutura e estilização
- **JavaScript ES6+** - Lógica de negócio
- **Chart.js** - Visualizações interativas
- **Font Awesome** - Ícones
- **🆕 jsPDF** - Geração de relatórios PDF

### **Processamento de Dados**
- **XLSX.js** - Leitura de arquivos Excel
- **Algoritmos proprietários** - Cálculos de turnover
- **Maps & Sets JavaScript** - Estruturas de dados otimizadas
- **🆕 Canvas to Image** - Conversão de gráficos para PDF

### **Hospedagem**
- **GitHub Pages** - Deploy automático
- **CDN Global** - Performance otimizada
- **HTTPS SSL** - Segurança garantida

## 🔒 **Segurança Corporativa**

### **Por que é 100% Seguro?**
- ✅ **Dados não saem do navegador** - processamento local
- ✅ **Zero APIs externas** - sem transmissão de dados
- ✅ **Código auditável** - toda lógica é visível
- ✅ **Equivalente ao Excel** - mesmo nível de segurança
- ✅ **LGPD/GDPR compliant** - nenhum dado é coletado
- ✅ **PDF gerado localmente** - sem upload para serviços externos

### **Aprovação Empresarial**
- 📋 [Guia de Segurança](README-seguranca.md)
- ⚖️ [Proteção Legal](protecao-legal-vazamento-dados.md)
- 📊 [Estrutura Planilha](requisitos-planilha.md)

## 📈 **Fórmulas de Cálculo**

### **Turnover Principal**
```
Turnover (%) = (("Ativo mês" + "Desligado mês") / 2) / Ativo × 100
```

### **Taxa Segmentada**
```
Taxa Colaborador (%) = Desligados "Colaborador" / Total Ativos × 100
Taxa Empresa (%) = Desligados "Empresa" / Total Ativos × 100
```

## 🎯 **Casos de Uso**

### **👥 Departamento de RH**
- Análise mensal de turnover
- **🆕 Relatórios executivos automatizados em PDF**
- Identificação de trends por cargo/área
- Comparação entre entidades/filiais

### **👔 Gestores e Diretores**
- KPIs visuais para apresentações
- **🆕 Relatórios PDF prontos para reuniões**
- Dashboards para tomada de decisão
- Análise de retenção por tempo de casa

### **📊 Analistas de People**
- Deep dive em dados demográficos
- **🆕 Documentação completa em PDF**
- Análise de motivos de desligamento
- Comparações temporais históricas

## 🌟 **Próximas Funcionalidades**

- [ ] **Import CSV** - Suporte além do Excel
- [ ] **Filtros avançados** - Múltiplas dimensões  
- [ ] **Previsões** - Machine learning para tendências
- [ ] **Themes customizáveis** - Cores da empresa
- [x] **✅ Relatórios PDF** - Export automatizado (IMPLEMENTADO)
- [ ] **Comparação temporal** - Períodos side-by-side

## 📞 **Suporte**

### **Documentação Completa**
- 📖 [Requisitos da Planilha](README-requisitos-planilha.md)
- 🔒 [Guia de Segurança](README-seguranca.md)

### **Contato**
- 📧 **Email**: [derekbarragao@gmail.com]
- 💼 **LinkedIn**: [https://www.linkedin.com/in/derek-barragão/]

---

### 🏆 **Por que Escolher Este Dashboard?**

| Recurso | Este Dashboard | Excel Manual | Power BI | Outras Soluções |
|---------|----------------|--------------|----------|-----------------|
| **Segurança** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Custo** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Visuais** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **PDF Export** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Velocidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

### 🎯 **Resumo**
**Sistema de análise de turnover profissional, gratuito, seguro e com export PDF automatizado - pronto para uso corporativo.**

---
