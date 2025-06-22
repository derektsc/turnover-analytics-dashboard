# Requisitos da Planilha Excel - Sistema de Análise de Turnover

## 📋 **Colunas Obrigatórias Mínimas**

Para funcionamento básico, sua planilha **DEVE** conter estas 3 colunas:

| Coluna | Tipo | Descrição | Valores Aceitos | Exemplo |
|--------|------|-----------|-----------------|---------|
| **`Mes`** | Número | Mês do registro | 1 a 12 | `1`, `2`, `12` |
| **`Ano`** | Número | Ano do registro | 4 dígitos | `2024`, `2025` |
| **`Status_2`** | Texto | Status do colaborador | Ver tabela abaixo | `Ativo`, `Desligado mês` |

### ⚠️ **Importante:**
- Os nomes das colunas são **case-sensitive** (maiúsculas e minúsculas importam)
- Use exatamente: `Mes` (sem acento), `Ano`, `Status_2`

## 📊 **Valores Aceitos para Status_2**

O sistema reconhece **APENAS** estes 4 status para calcular o turnover:

| Status | Descrição | Quando Usar |
|--------|-----------|-------------|
| **`Ativo`** | Funcionários ativos no final do mês | Colaboradores que estavam trabalhando no último dia do mês |
| **`Ativo mês`** | Funcionários admitidos no mês | Colaboradores que foram contratados durante o mês |
| **`Desligado mês`** | Funcionários demitidos no mês | Colaboradores que saíram da empresa durante o mês |
| **`Desligado`** | Funcionários já demitidos | Colaboradores que já haviam saído em meses anteriores |

### 🧮 **Fórmula de Cálculo do Turnover**
```
Turnover (%) = (("Ativo mês" + "Desligado mês") / 2) / Ativo × 100
```

## 🎯 **Colunas Opcionais (Funcionalidades Avançadas)**

### **Para Filtros por Entidade**
| Coluna | Tipo | Descrição | Exemplo | Funcionalidade |
|--------|------|-----------|---------|----------------|
| `ENTIDADE` | Texto | Nome da entidade/unidade | `Matriz`, `Filial SP` | Filtro dropdown no topo |

### **Para Análises de Demissões (Gráficos Adicionais)**
| Coluna | Tipo | Descrição | Exemplo | Gráficos Habilitados |
|--------|------|-----------|---------|---------------------|
| `Status` | Texto | Status detalhado | `Demissão`, `Desligamento` | Identifica demissões automático |
| `Denominação de Cargo` | Texto | Cargo do colaborador | `Analista`, `Gerente` | TOP 10 cargos com mais demissões |
| `Tempo de casa` | Texto | Tempo na empresa | `1 a 3 anos`, `5 a 10 anos` | Demissões por tempo de empresa |
| `Range-Idade` | Texto | Faixa etária | `25-30`, `31-40`, `41-50` | Demissões por geração |
| `Tipo de desligamento` | Texto | Tipo da saída | `Demissão sem justa causa` | Gráficos de tipos |
| `Motivo desligamento` | Texto | Motivo da saída | `Pedido de demissão` | Análise de motivos |

### **Para Análises Segmentadas (NOVO)**
| Coluna | Tipo | Descrição | Valores Esperados | Funcionalidade |
|--------|------|-----------|-------------------|----------------|
| `Tipo de desligamento` | Texto | Quem iniciou | `Colaborador`, `Empresa` | **Análises separadas por tipo** |

## 🎨 **Funcionalidades por Conjunto de Colunas**

### **✅ Nível 1: Básico (`Mes`, `Ano`, `Status_2`)**
- Cálculo de turnover mensal
- Gráfico de evolução do turnover por ano
- Estatísticas anuais (TO acumulado, média de ativos)
- Tabela de dados detalhados por mês/ano

### **✅ Nível 2: + `ENTIDADE`**
- Filtro por entidade no topo da página
- Análises segmentadas por unidade/regional
- Estatísticas filtradas por entidade

### **✅ Nível 3: + Colunas de Demografia**
- `Status` → Identificação automática de demissões
- `Denominação de Cargo` → TOP 10 cargos com mais demissões
- `Tempo de casa` → Análise de retenção por senioridade
- `Range-Idade` → Análise demográfica por geração
- `Tipo de desligamento` → Análise de tipos de saída

### **🆕 Nível 4: Análises Segmentadas (NOVO)**
Quando a coluna `Tipo de desligamento` contém `"Colaborador"` ou `"Empresa"`:

**📊 Seção "Análises Complementares":**

**Para Tipo "Colaborador":**
- Taxa de Desligamento Colaborador (linha temporal)
- TOP 10 Demissões "Colaborador" por Cargo
- Tempo de Casa - Demissões "Colaborador"
- Demissões "Colaborador" por Geração
- Motivos de Desligamento - "Colaborador"

**Para Tipo "Empresa":**
- Taxa de Desligamento Empresa (linha temporal)
- TOP 10 Demissões "Empresa" por Cargo
- Tempo de Casa - Demissões "Empresa"
- Demissões "Empresa" por Geração
- Motivos de Desligamento - "Empresa"

**Fórmulas das Taxas:**
```
Taxa Colaborador (%) = Desligados "Colaborador" / Total Ativos × 100
Taxa Empresa (%) = Desligados "Empresa" / Total Ativos × 100
```

## 📁 **Exemplo de Planilha Completa**

```excel
| Mes | Ano  | Status_2       | ENTIDADE  | Status    | Denominação de Cargo | Tempo de casa | Range-Idade | Tipo de desligamento | Motivo desligamento |
|-----|------|----------------|-----------|-----------|---------------------|---------------|-------------|----------------------|---------------------|
| 1   | 2024 | Ativo          | Matriz    | Ativo     | Analista           | 1 a 3 anos    | 25-30       | -                    | -                   |
| 1   | 2024 | Ativo          | Matriz    | Ativo     | Gerente            | 5 a 10 anos   | 35-40       | -                    | -                   |
| 1   | 2024 | Ativo mês      | Filial SP | Ativo     | Assistente         | 0 a 1 ano     | 20-25       | -                    | -                   |
| 1   | 2024 | Desligado mês  | Matriz    | Demissão  | Analista           | 2 a 5 anos    | 30-35       | Colaborador          | Pedido de demissão  |
| 1   | 2024 | Desligado mês  | Filial SP | Demissão  | Coordenador        | 3 a 5 anos    | 35-40       | Empresa              | Reestruturação      |
| 2   | 2024 | Ativo          | Matriz    | Ativo     | Gerente            | 5 a 10 anos   | 35-40       | -                    | -                   |
| 2   | 2024 | Ativo          | Filial SP | Ativo     | Assistente         | 0 a 1 ano     | 20-25       | -                    | -                   |
| 2   | 2024 | Desligado      | Matriz    | Demissão  | Analista           | 2 a 5 anos    | 30-35       | Colaborador          | Pedido de demissão  |
```

## 🎯 **Dashboard Completo - Todas as Seções**

### **📈 Seção Principal**
1. **KPIs Anuais** - TO acumulado e média de ativos por ano
2. **Evolução do Turnover** - Linha temporal mensal
3. **Demissões por Cargo** - TOP 10 cargos 
4. **Demissões por Tempo de Casa** - Distribuição por senioridade
5. **Demissões por Geração** - Distribuição por faixa etária
6. **Tipos de Desligamento** - Distribuição geral
7. **Dados Detalhados** - Tabela com totais mensais

### **🔍 Seção "Análises Complementares" (Novo)**
8. **Dados - Taxa Colaborador** - Base de cálculo
9. **Taxa de Desligamento - Colaborador** - Evolução temporal
10. **TOP 10 Demissões "Colaborador" por Cargo**
11. **Tempo de Casa - Demissões "Colaborador"**
12. **Demissões "Colaborador" por Geração**
13. **Motivos - "Colaborador"**
14. **Dados - Taxa Empresa** - Base de cálculo
15. **Taxa de Desligamento - Empresa** - Evolução temporal
16. **TOP 10 Demissões "Empresa" por Cargo**
17. **Tempo de Casa - Demissões "Empresa"**
18. **Demissões "Empresa" por Geração**
19. **Motivos - "Empresa"**

## ⚠️ **Validações e Erros Comuns**

### **Erro: "Colunas necessárias não encontradas"**
**Causa:** Faltam as colunas obrigatórias  
**Solução:** Certifique-se que sua planilha tem `Mes`, `Ano` e `Status_2`

### **Erro: "Nenhum dado válido encontrado"**
**Causa:** Status_2 com valores não reconhecidos  
**Solução:** Use apenas: `Ativo`, `Ativo mês`, `Desligado mês`, `Desligado`

### **Gráficos não aparecem**
**Causa:** Coluna correspondente não existe ou está vazia  
**Solução:** Verifique se as colunas opcionais estão preenchidas corretamente

### **Análises Complementares não aparecem**
**Causa:** Coluna `Tipo de desligamento` não contém "Colaborador" ou "Empresa"  
**Solução:** Preencha com exatamente esses termos (case-insensitive)

## 📋 **Template Recomendado**

Baixe este template e preencha com seus dados:

```excel
Mes | Ano | Status_2 | ENTIDADE | Status | Denominação de Cargo | Tempo de casa | Range-Idade | Tipo de desligamento | Motivo desligamento
----|-----|----------|----------|--------|---------------------|---------------|-------------|----------------------|--------------------
1   | 2024| Ativo    | Matriz   | Ativo  | Analista           | 1 a 3 anos    | 25-30       | -                    | -
1   | 2024| Ativo mês | Filial   | Ativo  | Assistente         | 0 a 1 ano     | 20-25       | -                    | -
1   | 2024| Desligado mês | Matriz | Demissão | Coordenador    | 2 a 5 anos    | 30-35       | Colaborador          | Pedido de demissão
```

## 🚨 **Checklist Final**

Antes de fazer upload, confirme:

- [ ] ✅ Arquivo está em formato `.xlsx`
- [ ] ✅ Primeira linha contém cabeçalhos
- [ ] ✅ Colunas `Mes`, `Ano`, `Status_2` estão presentes
- [ ] ✅ Nomes das colunas estão corretos (sem acentos, case-sensitive)
- [ ] ✅ Status_2 contém apenas: `Ativo`, `Ativo mês`, `Desligado mês`, `Desligado`
- [ ] ✅ Dados de Mes são números 1-12
- [ ] ✅ Dados de Ano são números (ex: 2024)
- [ ] ✅ Não há linhas completamente vazias no meio dos dados
- [ ] ✅ Para análises avançadas: colunas opcionais preenchidas
- [ ] ✅ Para análises segmentadas: `Tipo de desligamento` com "Colaborador"/"Empresa"

## 💡 **Dicas para Melhores Resultados**

### **📊 Para Gráficos Mais Ricos**
1. **Padronize nomes** de cargos e entidades (evite variações)
2. **Use categorias consistentes** para tempo de casa (ex: "0 a 1 ano", "1 a 3 anos")
3. **Mantenha faixas etárias uniformes** (ex: "25-30", "31-40")
4. **Seja específico nos motivos** de desligamento para melhor análise

### **🎯 Para Análises Segmentadas**
5. **Use exatamente "Colaborador" e "Empresa"** na coluna Tipo de desligamento
6. **Preencha motivos detalhados** para análises mais precisas
7. **Mantenha consistência temporal** para comparações válidas

### **🔍 Para Troubleshooting**
8. **Teste com dados pequenos** primeiro
9. **Verifique console do navegador** para erros
10. **Use filtro por entidade** para debugar dados específicos

## 📞 **Dúvidas Frequentes**

**P: Posso ter outras colunas além das listadas?**  
R: **Sim!** O sistema ignora colunas extras. Apenas as listadas são utilizadas.

**P: A ordem das colunas importa?**  
R: **Não.** As colunas podem estar em qualquer ordem.

**P: Como sei se as análises segmentadas vão funcionar?**  
R: **Verifique se** a coluna `Tipo de desligamento` contém pelo menos alguns registros com "Colaborador" ou "Empresa".

**P: Por que alguns gráficos não aparecem?**  
R: **Cada gráfico requer** colunas específicas. Se a coluna não existir ou estiver vazia, o gráfico mostra "Nenhum dado disponível".

**P: Posso misturar dados de diferentes empresas?**  
R: **Sim!** Use a coluna `ENTIDADE` para separar e filtre conforme necessário.

**P: O sistema funciona com dados históricos de vários anos?**  
R: **Perfeitamente!** O sistema agrupa automaticamente por ano e permite comparações temporais.

## 🏆 **Resultado Final**

Com todas as colunas preenchidas corretamente, você terá:

✅ **19 visualizações diferentes** de análise de turnover  
✅ **Dashboards interativos** com drill-down  
✅ **Filtros dinâmicos** por entidade  
✅ **Análises segmentadas** por tipo de desligamento  
✅ **Exportação de gráficos** em alta qualidade  
✅ **Comparações temporais** automáticas  
✅ **KPIs executivos** para apresentações
