import { Component } from "react";
import { withTranslation } from "react-i18next";
import Button from "./Button";
import KemetricsMark from "./KemetricsMark";

class ErrorBoundaryView extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { t, children } = this.props;

    if (!this.state.hasError) return children;

    return (
      <main className="flex min-h-screen items-center justify-center p-[16px] text-textColor">
        <div className="surface-card flex w-full max-w-[420px] flex-col items-center gap-[16px] p-[28px] text-center">
          <KemetricsMark className="h-[64px] w-[51px]" />
          <h1 className="text-xl font-extrabold">{t("general.errorTitle")}</h1>
          <p className="text-sm text-mutedText">{t("general.errorMessage")}</p>
          <Button onClick={this.handleReload}>{t("general.reload")}</Button>
        </div>
      </main>
    );
  }
}

const ErrorBoundary = withTranslation()(ErrorBoundaryView);

export default ErrorBoundary;
