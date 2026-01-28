import { toast } from "react-toastify";

export const confirmActionToast = (
  message: string,
  onConfirm: () => void,
  confirmLabel = "Confirm"
) => {
  toast(
    ({ closeToast }) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-white">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              closeToast?.();
              onConfirm();
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded text-sm"
          >
            {confirmLabel}
          </button>

          <button
            onClick={closeToast}
            className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};
