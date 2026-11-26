import { createPortal } from "react-dom";
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useOutsideClick } from "../hooks/useOutesideClick";

const ModalContext = createContext();

function Modal({ children, onClose }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = (windowName) => setOpenName(windowName);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ opens: opensWindowName, children }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const [t] = useTranslation();
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };

    if (name === openName) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [name, openName, close]);

  if (name !== openName) return null;

  return createPortal(
    <div role="dialog" aria-modal="true">
      <div
        className={`fixed left-0 top-0 z-[102] h-full w-full bg-[#061a45]/40 backdrop-blur-sm`}
      ></div>

      <div className="fixed left-0 top-0 z-[103] h-full w-full">
        <div
          className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[90%] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-2xl border border-line bg-secondary p-[15px] shadow-card md:w-[750px] md:p-[30px] lg:w-[800px]"
          ref={ref}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t("general.close")}
            className="absolute end-[12px] top-[12px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-primary text-textColor transition-colors hover:bg-colorBrand hover:text-white"
          >
            <FaTimes className="text-xl" />
          </button>
          <div>{cloneElement(children, { onCloseModal: close })}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
