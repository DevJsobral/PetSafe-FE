# PetSafe - Frontend (React + Vite + Tailwind)

Atualização: o frontend agora inclui um *mock* local que utiliza `localStorage` para testar o fluxo sem backend.
As funções que conversam com a API continuam centralizadas em `src/api.js`, mas hoje já estão implementadas como mock para desenvolvimento.

## Como rodar

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Rodar em modo desenvolvimento:
   ```bash
   npm run dev
   ```

3. Ao abrir o app:
   - Cadastre uma conta em *Cadastro* (Register).
   - Em seguida, acesse *Cadastrar Pet* para criar pets.
   - Adicione vacinas e registros de peso nas telas de detalhes.

4. Para integrar com backend:
   - Substitua o conteúdo de `src/api.js` pelas chamadas reais (mantenha a mesma interface).
   - Remova/ajuste o uso de `localStorage` se necessário.

## O que foi adicionado
- Mock completo em `src/api.js` (usuários, pets, vacinas, pesos) usando `localStorage`.
- Validação básica nos formulários (Login, Register, Add Pet, Add Vaccine).
- Loading e Toast components para feedback do usuário.
- Tela de detalhes do pet agora carrega dados reais do mock e permite:
  - Visualizar vacinas dinâmicas.
  - Adicionar registros de peso (mostrados em gráfico SVG simples).


## Testes

O projeto inclui testes básicos com Jest + React Testing Library.

Instale dependências e rode:
```bash
npm install
npm test
```

## Dark Mode

Há um botão na navbar para alternar entre claro e escuro. A preferência é salva em `localStorage`.
