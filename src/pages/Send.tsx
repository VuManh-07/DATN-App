import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Input, Modal, Typography, message } from "antd";
import { Field, Panel } from "../components/ui";
import { useWallet } from "../lib/WalletContext";
import { mockApi } from "../mock/api";
import { formatAmount } from "../lib/format";

/**
 * Send native currency.
 *
 * Two steps on purpose. The form collects, the dialog confirms, and the
 * recipient is shown in full in the dialog -- never truncated. A transfer is
 * irreversible and the address is the one field a user cannot check
 * afterwards, so the last thing they see before signing is all 42 characters
 * of it.
 */
const Send = () => {
  const navigate = useNavigate();
  const { account, network, refresh } = useWallet();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [fee, setFee] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account) return;
    void mockApi.nativeBalance(account.index).then(setBalance);
    void mockApi.estimateFee().then(setFee);
  }, [account]);

  const ready = /^0x[0-9a-fA-F]{40}$/.test(to) && Number(amount) > 0;

  const submit = async () => {
    if (!account) return;
    setBusy(true);
    setError(null);
    try {
      await mockApi.send({ accountIndex: account.index, to, amount });
      setConfirming(false);
      message.success("Đã gửi giao dịch.");
      refresh();
      navigate("/history");
    } catch (err) {
      // Stay in the dialog: the user's next move is to fix a field, and
      // closing it would hide what they typed.
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page--head">
        <h2>Chuyển tiền</h2>
        <p>
          Từ {account?.name} trên {network?.name}
        </p>
      </div>

      <Panel title="Thông tin giao dịch">
        <div className="send--form">
          <label>
            <span>Địa chỉ nhận</span>
            <Input
              size="large"
              placeholder="0x…"
              value={to}
              onChange={(e) => setTo(e.target.value.trim())}
              status={to && !/^0x[0-9a-fA-F]{40}$/.test(to) ? "error" : ""}
            />
            {to && !/^0x[0-9a-fA-F]{40}$/.test(to) && (
              <em className="send--hint is-error">
                Địa chỉ phải bắt đầu bằng 0x và có 40 ký tự hex.
              </em>
            )}
          </label>

          <label>
            <span>Số lượng ({network?.symbol})</span>
            <Input
              size="large"
              placeholder="0.0"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              suffix={
                <Button
                  type="link"
                  size="small"
                  disabled={!balance}
                  onClick={() => balance && setAmount(balance)}
                >
                  Tối đa
                </Button>
              }
            />
            <em className="send--hint">
              Khả dụng: {balance === null ? "…" : formatAmount(balance)}{" "}
              {network?.symbol} · Phí ước tính:{" "}
              {fee === null ? "…" : formatAmount(fee)} {network?.symbol}
            </em>
          </label>

          <Button
            type="primary"
            size="large"
            disabled={!ready}
            onClick={() => {
              setError(null);
              setConfirming(true);
            }}
          >
            Tiếp tục
          </Button>
        </div>
      </Panel>

      <Modal
        title="Xác nhận giao dịch"
        open={confirming}
        onCancel={() => setConfirming(false)}
        onOk={submit}
        okText="Xác nhận gửi"
        cancelText="Hủy"
        confirmLoading={busy}
      >
        {error && (
          <Alert
            type="error"
            showIcon
            message={error}
            style={{ marginBottom: 16 }}
          />
        )}

        <Field label="Đến" mono>
          <Typography.Text copyable={{ text: to }}>{to}</Typography.Text>
        </Field>
        <Field label="Số lượng">
          {amount} {network?.symbol}
        </Field>
        <Field label="Phí ước tính">
          {fee === null ? "…" : formatAmount(fee)} {network?.symbol}
        </Field>
        <Field label="Mạng">{network?.name}</Field>
      </Modal>
    </>
  );
};

export default Send;
