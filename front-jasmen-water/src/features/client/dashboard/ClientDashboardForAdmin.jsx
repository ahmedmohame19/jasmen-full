import { useTranslation } from "react-i18next";
import { useClient } from "../useClient";
import { useWebSocket } from "../../../hooks/useWebSocket";
import Spinner from "../../../ui/spinner/Spinner";
import Empty from "../../../ui/Empty";
import Heading from "../../../ui/Heading";
import UserInfoConsumptionChart from "../../users/UserInfoConsumptionChart";
import Charges from "./Charges";
import Button from "../../../ui/Button";
import { useParams } from "react-router-dom";
import { baseURL } from "../../../services/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import ConfirmModal from "../../../ui/ConfirmModal";
import "./ClientDashboardForAdmin.css";

function ClientDashboardForAdmin() {

    const { id } = useParams();

    const [t] = useTranslation();
    const { isLoading, client } = useClient(id);
    const { userRealTimeData } = useWebSocket(id);
    const queryClient = useQueryClient();
    const [showCharges, setShowCharges] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [chargeToDelete, setChargeToDelete] = useState(null);

    const { consumption = null, consumptionLimit = null } =
        userRealTimeData || {};

    if (isLoading) return <Spinner />;
    if (!client) return <Empty message={t("client.noClientData")} />;

    const realTimePercentage =
        consumptionLimit > 0
            ? ((consumption / consumptionLimit) * 100).toFixed(0)
            : null;

    const percentage =
        client?.consumption > 0 && client?.limit > 0
            ? ((client?.consumption / client?.limit) * 100).toFixed(0)
            : 0;

    const displayPercentage =
        realTimePercentage !== null ? realTimePercentage : percentage;

    const access_token = localStorage.getItem("WATER_USER_TOKEN");

    const handleDeleteClick = (chargeId) => {
        setChargeToDelete(chargeId);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!chargeToDelete) return;

        try {
            const response = await axios.delete(`${baseURL}user/v1/ClearUserCharges/${client?._id}/charge/${chargeToDelete}`, {
                headers: {
                    access_token,
                }
            });
            if (response.data?.success) {
                // Refetch client data to update the charges
                await queryClient.invalidateQueries({ queryKey: ["clientInfo", id] });
                toast.success(t("users.chargesClearedSuccessfully"));
            } else {
                toast.error(t("users.chargesClearedFailed"));
            }
        } catch (error) {
            console.error("Error clearing charges:", error);
            toast.error(t("users.chargesClearedFailed"));
        } finally {
            setShowConfirmModal(false);
            setChargeToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setChargeToDelete(null);
    };

    return (
        <div className="flex flex-col gap-[20px]">
            <div className="surface-card p-[10px]">
                <Heading>
                    {t("general.hello")}, {client?.userName}
                </Heading>
            </div>

            {client?.charging?.length > 0 && (
                <div className="surface-card p-[10px]">
                    <Button
                        variant="primary"
                        className="px-4 py-2 rounded-md transition-colors duration-200 font-medium"
                        onClick={() => setShowCharges(!showCharges)}
                    >
                        {showCharges ? t("users.hideCharges") : t("users.showCharges")}
                    </Button>
                </div>
            )}

            <div className={`surface-card p-[10px] transition-all duration-300 ease-in-out overflow-hidden ${showCharges && client?.charging?.length > 0
                ? 'max-h-[1000px] opacity-100'
                : 'max-h-0 opacity-0 p-0'
                }`}>
                <Heading className="mb-4">{t("users.charges")}</Heading>
                <div className="grid mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {client?.charging?.map((charge, index) => (
                        <div
                            key={index}
                            className="bg-secondary rounded-lg p-4 shadow-md border border-gray-200
                             dark:border-gray-700 relative group hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: showCharges ? 'fadeInUp 0.5s ease-out forwards' : 'fadeOutDown 0.3s ease-in forwards'
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">
                                    {charge?.name || t("users.charge")} #{index + 1}
                                </h3>
                                <button
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full"
                                    title={t("users.deleteCharge")}
                                    onClick={() => handleDeleteClick(charge?._id)}
                                >
                                    <FaTrash className="text-red-500 hover:text-red-700 text-sm" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>
                                        {t("users.amount")}:
                                    </span>
                                    <span className="font-medium">
                                        {charge?.money || 0} {t("general.EGP")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>
                                        {t("users.date")}:
                                    </span>
                                    <span className="font-medium">
                                        {charge?.createdAt ? new Date(charge.createdAt).toLocaleDateString() : t("general.notAvailable")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>
                                        {t("users.time")}:
                                    </span>
                                    <span className="font-medium">
                                        {charge?.createdAt ? new Date(charge.createdAt).toLocaleTimeString() : t("general.notAvailable")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!client?.charging || client?.charging?.length === 0) && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                {t("users.noCharges")}
                            </p>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex flex-col items-start gap-[10px] lg:flex-row">
                <UserInfoConsumptionChart
                    percentage={displayPercentage}
                    title={t("users.userConsumption")}
                />
                <Charges charges={client?.charging} />
            </div>

            {/* Custom Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={t("users.deleteChargeTitle")}
                message={t("users.deleteChargeMessage")}
                confirmText={t("users.deleteChargeConfirm")}
                cancelText={t("general.cancel")}
            />
        </div>
    );
}

export default ClientDashboardForAdmin;
