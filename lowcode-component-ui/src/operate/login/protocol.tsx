import React, {Form, Checkbox} from "antd";
import { FC, ReactNode, useState, MouseEvent } from "react";
import loginContext from "./context";
import { Container, Element } from "@brushes/component-core";
import { Text } from "../../basic";
import { post } from "@brushes/request";
import {Modal} from "antd";

const Protocol: FC<{
  children: ReactNode;
  isNeedRegister: boolean;
  actionImpl: (e: string) => void;
  mode?: string;
  isInDrawer?: boolean;
  isExternalLogin?: boolean;
}> = ({ actionImpl, children, isNeedRegister, mode, isInDrawer, isExternalLogin }) => {
  const { mode: globalMode } = loginContext.useOpenValues();
  const currentMode = mode ?? globalMode;
  const shouldHideProtocol = isInDrawer || (!isExternalLogin && ["update"].includes(currentMode));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalYsOpen, setIsModalYsOpen] = useState(false);
  const [modalData, setModalData] = useState<{proappConfigText2?: string}>({});
  const [modalYsData, setModalYsData] = useState<{proappConfigText2?: string}>({});

  const showModal = async (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const res = await post('/web/tm/Proapp/queryProappConfigByChannelAgreement.json', { rows: 1, page: 1, dataState: 0, proappConfigType: "dealer" });
    if (res.list && res.list.length > 0) {
      setModalData(res.list[0]);
    }
    setIsModalOpen(true);
  };

  const showModal1 = async (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const res = await post('/web/tm/Proapp/queryProappConfigByChannelAgreement.json', { rows: 1, page: 1, dataState: 0, proappConfigType: "privacy" });
    if (res.list && res.list.length > 0) {
      setModalYsData(res.list[0]);
    }
    setIsModalYsOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancel1 = () => {
    setIsModalYsOpen(false);
  };

  return (
    <>
      <div className="bottom-protocol">
        {shouldHideProtocol ? (
          <div></div>
        ) : (
          <Form.Item
            name="protocol1"
            valuePropName="checked"
            rules={[{ required: true, message: "请阅读并同意《用户协议》和《隐私协议》" }]}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Checkbox>
                <span style={{ fontSize: 13 }}>
                  请阅读并同意
                  <span
                    onClick={(e) => showModal(e)}
                    style={{ color: '#1677ff', cursor: 'pointer' }}
                  >
                    《用户协议》
                  </span>
                  和
                  <span
                    onClick={(e) => showModal1(e)}
                    style={{ color: '#1677ff', cursor: 'pointer' }}
                  >
                    《隐私协议》
                  </span>
                </span>
              </Checkbox>
              <Element width={180} id={"info"} canvas is={Container}></Element>
            </div>
          </Form.Item>
        )}
        <Element width={100} id={"register"} canvas is={Container}></Element>
      </div>

      <Modal
        title="用户协议"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="60%"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: modalData.proappConfigText2 || '暂无内容'
          }}
        />
      </Modal>

      <Modal
        title="隐私协议"
        open={isModalYsOpen}
        onCancel={handleCancel1}
        footer={null}
        width="60%"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: modalYsData.proappConfigText2 || '暂无内容'
          }}
        />
      </Modal>
    </>
  );
};

export default Protocol;
