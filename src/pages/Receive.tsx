import React from "react";
import { Empty, Typography } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";
import { Panel } from "../components/ui";
import { useWallet } from "../lib/WalletContext";

/**
 * Receive screen.
 *
 * The address is the whole point, so it leads: a QR to scan from a phone and
 * the full string underneath. Never truncated here -- an address a user
 * cannot read in full is an address they cannot check against what they typed
 * somewhere else.
 */
const Receive = () => {
  const { account, network } = useWallet();
  const address = account?.address || "";

  return (
    <>
      <div className="page--head">
        <h2>Nhận</h2>
        <p>Địa chỉ nhận của {account?.name}</p>
      </div>

      <Panel title="Địa chỉ ví" hint="Quét mã QR hoặc copy chuỗi bên dưới">
        {address ? (
          <div className="receive--block">
            <div className="receive--qr">
              <QRCodeSVG
                value={address}
                size={184}
                level="M"
                includeMargin
                bgColor="#ffffff"
                fgColor="#0e1014"
              />
            </div>

            <div className="receive--address">
              <span className="receive--address--text">{address}</span>
              <Typography.Text
                className="receive--address--copy"
                copyable={{
                  text: address,
                  icon: [
                    <CopyOutlined key="copy" />,
                    <CheckOutlined key="copied" />,
                  ],
                  tooltips: ["Copy địa chỉ", "Đã copy"],
                }}
              />
            </div>

            <p className="receive--hint">
              Chỉ gửi tài sản trên mạng <strong>{network?.name}</strong> tới
              địa chỉ này.
            </p>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa chọn tài khoản"
          />
        )}
      </Panel>
    </>
  );
};

export default Receive;
