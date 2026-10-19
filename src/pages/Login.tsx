import React, { useState } from "react";
import { Alert, Button, Input } from "antd";
import { useWallet } from "../lib/WalletContext";
import { DEMO_PIN } from "../mock/data";
import "./Login.scss";

/**
 * PIN entry.
 *
 * The error line is the whole screen: a wallet that says only "wrong PIN"
 * while silently counting down to a locked card is a wallet that locks cards.
 * The message from the mock backend already carries the remaining attempts,
 * so it is shown verbatim rather than replaced with something friendlier.
 */
const Login = () => {
  const { unlock } = useWallet();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await unlock(pin);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPin("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <div className="login--card">
        <span className="login--logo">◈</span>
        <h1>DATN Wallet</h1>
        <p className="login--sub">Nhập mã PIN để mở ví</p>

        <Input.Password
          size="large"
          value={pin}
          maxLength={8}
          autoFocus
          placeholder="8 chữ số"
          // Digits only: the applet PIN has no other alphabet, so rejecting
          // the keystroke beats validating after the fact.
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          onPressEnter={submit}
        />

        {error && (
          <Alert
            className="login--error"
            type="error"
            showIcon
            message={error}
          />
        )}

        <Button
          type="primary"
          size="large"
          block
          loading={busy}
          disabled={pin.length !== 8}
          onClick={submit}
        >
          Mở ví
        </Button>

        <p className="login--demo">
          Bản demo dùng dữ liệu giả lập — PIN: <code>{DEMO_PIN}</code>
        </p>
      </div>
    </div>
  );
};

export default Login;
