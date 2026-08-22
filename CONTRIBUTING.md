# Contributing to DocTransfer

Thank you for your interest in contributing to **DocTransfer**! We are committed to building an open, accessible, and secure document sharing and Virtual Data Room platform, and we welcome contributions from developers of all skill levels.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior according to the guidelines outlined there.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm**
- **Git**

### 2. Setting Up Your Development Environment

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/DocTransfer.git
   cd DocTransfer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase project URL and anon public key.
5. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 🌿 Branching Strategy & Workflow

1. Create a feature branch with a descriptive name from `main`:
   ```bash
   git checkout -b feat/add-slack-webhook-notifications
   # or
   git checkout -b fix/drm-canvas-rendering-glitch
   ```
2. Make focused, modular commits following the **Conventional Commits** specification.
3. Test your changes locally before submitting a Pull Request.

---

## 💬 Commit Message Convention

We adhere to [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Common Types:
- `feat`: A new user-facing feature or capability
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Formatting, missing semi-colons, whitespace fixes (no code changes)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, dependency updates, or auxiliary tools

*Example:* `feat(vdr): add multi-folder batch download option`

---

## 🧪 Testing & Code Quality

Before opening a Pull Request, please ensure all quality checks pass:

```bash
# Run TypeScript compilation check
npm run build

# Run ESLint linter
npm run lint
```

---

## 🚀 Submitting a Pull Request (PR)

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of the upstream repository.
3. Fill in the Pull Request template detailing:
   - What changed and why
   - How you verified the changes
   - Screenshots / Screen recordings for visual or UI updates
4. Be responsive to feedback and reviews during the review process.

---

## 💡 Reporting Bugs & Requesting Features

- **Bug Reports**: Use our [Bug Report Template](https://github.com/simplegithubs/DocTransfer3949/issues/new?template=bug_report.yml) to provide full reproduction steps, environment details, and screenshots/logs.
- **Feature Requests**: Propose ideas using our [Feature Request Template](https://github.com/simplegithubs/DocTransfer3949/issues/new?template=feature_request.yml).
- **Questions**: If you have questions about how to use DocTransfer or need help self-hosting, feel free to start a discussion in GitHub Discussions.

---

## 📄 License

By contributing to DocTransfer, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
