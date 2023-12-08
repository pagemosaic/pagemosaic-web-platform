export interface ActionDataRequestErrorProps {
    actionData: any;
}

export function ActionDataRequestError(props: ActionDataRequestErrorProps) {
    const {actionData} = props;
    if (actionData && actionData.error) {
        return (
            <p className="text-xs text-red-600">{actionData.error}</p>
        );
    }
    return null;
}
