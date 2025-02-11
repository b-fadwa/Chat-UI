import { FC, useCallback, useState } from 'react';
import { MessageList } from 'react-chat-elements';


interface ChatBodyProps {
    data: any;
    socket: WebSocket;
    pollID: number;
}

// ws://websocket

const ChatBody: FC<ChatBodyProps> = ({ data, socket, pollID }) => {
    let parsedItem: any;
    let isSender: boolean;

    const [pollResponses, setPollResponses] = useState<Record<string, any>>({});

    const handlePollResponse = useCallback((option: string, parsedItem: any) => {
        console.log("This is the polllllllll", parsedItem);

        if (parsedItem.poll && parsedItem.poll.pollID) {
            setPollResponses((prev) => {
                const updatedResponses = { ...prev, [parsedItem.poll.pollID]: [option] };
                return updatedResponses;
            });

            if (socket) {
                const pollData = { pollID: parsedItem.poll.pollID, selectedOptions: [option] };
                socket.send(JSON.stringify({ poll: pollData }));
                console.log(parsedItem.poll.pollID);
            }
        }
    }, [socket]);

    const getOptionCounts = (poll: any) => {
        const counts: Record<string, number> = {};
        poll.selectedOptions.forEach((item: any) => {
            const option = item.selectedOptions.option;
            counts[option] = (counts[option] || 0) + 1;
        });
        return counts;
    };

    const renderPollResults = (poll: any) => {
        if (!poll) return null;  // Check if poll is null or undefined
        const counts = getOptionCounts(poll);
        console.log("FROM POLL RESULTS", poll.pollID);
        return poll.options.map((option: string, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                <input
                    type="checkbox"
                    id={`poll-${i}`}
                    name={poll.pollID}
                    value={option}
                    checked={poll.selectedOptions.some((item: any) => item.selectedOptions.option === option)}
                    onChange={() => handlePollResponse(option, poll)}
                />
                <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label htmlFor={`poll-${i}`} style={{ fontWeight: 'bold' }}>
                            {option}
                        </label>
                        <span style={{ fontWeight: 'bold' }}>{counts[option] || 0}</span>
                    </div>
                    <meter min="0" max="100" value={(counts[option] || 0) * 10} style={{ width: '100%' }} />
                </div>
            </div>
        ));
    };




    data = data.map((item: any, index: number) => {
        parsedItem = JSON.parse(item);
        isSender = parsedItem.sender ? parsedItem.sender.startsWith('localhost') : true; //to be updated

        if (
            (parsedItem.content == '') &&
            (parsedItem.sender != '') &&
            !parsedItem.file &&
            !parsedItem.audio &&
            !parsedItem.image &&
            !parsedItem.poll
        ) {
            return null;
        }
        //text
        if (parsedItem.content) {
            return {
                type: 'text',
                text: parsedItem.content,
                title: parsedItem.sender,
                position: isSender ? 'left' : 'right',
            };
        }
        // file object
        if (parsedItem.file) {
            console.log("file added")
            return {
                type: 'file',
                text: 'File attached',
                title: parsedItem.sender,
                data: {
                    uri: parsedItem.file,
                    status: {
                        click: false,
                        loading: 0,
                    },
                },
                file: parsedItem.file,
                url: parsedItem.file,
                position: isSender ? 'right' : 'left',
            };
        }
        //audio object
        if (parsedItem.audio) {
            console.log("audio added")
            return {
                type: 'audio',
                title: parsedItem.sender,
                data: {
                    audioURL: parsedItem.audio,
                    status: {
                        click: false,
                        loading: 0,
                    },
                },
                position: isSender ? 'right' : 'left',
            };
        }
        //picture object
        if (parsedItem.image) {
            return {
                type: 'photo',
                title: parsedItem.sender,
                data: {
                    uri: parsedItem.image,
                    status: {
                        click: false,
                        loading: 0,
                    },
                },
                position: isSender ? 'right' : 'left',
            };
        }
        //poll Object
        if (parsedItem.poll) {
            console.log(parsedItem.poll.selectedOptions.map((item: any) => item.selectedOptions.option))

            const poll = parsedItem.poll;
            const optionCounts = getOptionCounts(poll);
            console.log("THIS IS OPTIONCOUNTS :", optionCounts);

            if (parsedItem.poll) {
                return {
                    type: 'text',
                    text: (
                        <div>
                            <h4>{parsedItem.poll.question}</h4>
                            {renderPollResults(parsedItem.poll)}
                        </div>
                    ),
                    title: parsedItem.sender,
                    position: isSender ? 'left' : 'right',
                };
            }
        }
    });

    const handleDownload = (message: any) => {
        const fileUrl = message.data?.uri || message.data?.audioURL || message.data.url;
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = message.type;
            link.click();
        }
    };

    return (
        <div className="chat-body">
            <MessageList
                {...({ dataSource: data } as any)}
                onDownload={(message: any) => {
                    handleDownload(message);
                }}
                className="message-list bg-grey-50"
            />
        </div>
    );
};

export default ChatBody;
