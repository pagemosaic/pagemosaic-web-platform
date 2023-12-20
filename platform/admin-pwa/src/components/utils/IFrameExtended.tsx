import React, {CSSProperties, forwardRef, RefAttributes, useEffect, useImperativeHandle, useRef} from 'react';

const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflowY: 'hidden',
    overflowX: 'auto',
    inset: 0,
    borderRadius: '8px',
    border: '1px dashed #cdcdcd',
};

export type IFrameExtendedHandle = {
    reloadPage: () => void;
    loadURL: (url: string) => void;
    setFocus: () => void;
    sendMessage: (message: any) => void;
};

export type IFrameExtendedProps = RefAttributes<IFrameExtendedHandle> & {
    url?: string;
    srcdoc?: string;
    zoomOut?: boolean;
    onIFrameReady?: (url: string) => void;
    onIFrameMessage?: (data: any) => void;
};

const IFrameExtended = forwardRef<IFrameExtendedHandle, IFrameExtendedProps>((props, ref) => {
    const {
        url,
        srcdoc,
        zoomOut,
        onIFrameReady = () => {
        },
        onIFrameMessage = () => {
        }
    } = props;


    const frameWindow = useRef<HTMLIFrameElement>(null);


    const innerContainerStyle: CSSProperties = zoomOut
        ? {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '200%', /* Double the width and height to compensate for the scaling */
            height: '200%',
            transformOrigin: 'top left',
            transform: 'scale(0.5)', /* Adjust this value to control the zoom level */
        }
        : {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
        };

    const iFrameStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
    };

    return (
        <div style={containerStyle}>
            <div style={innerContainerStyle}>
                <iframe
                    title="IFrame"
                    ref={frameWindow}
                    style={iFrameStyle}
                    src={url}
                    srcDoc={srcdoc}
                >
                </iframe>
            </div>
        </div>
    );
});

export default IFrameExtended;
