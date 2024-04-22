// Importing function
import { generateNodeID } from "../functions/Snowflakes/GenerateNodeID";

// Class to define the structure of a snowflake ID and generate them accordingly
class Snowflake {
    private static readonly EPOCH = 1609459200000; // Unix epoch start time in milliseconds (January 1, 2021)

    private static readonly NODE_ID_BITS = 10;
    private static readonly SEQUENCE_BITS = 12;

    private static readonly MAX_NODE_ID = (1 << Snowflake.NODE_ID_BITS) - 1;
    private static readonly MAX_SEQUENCE = (1 << Snowflake.SEQUENCE_BITS) - 1;

    private nodeId: number;
    private sequence: bigint = 0n;
    private lastTimestamp: bigint = -1n;

    constructor(nodeId: number) {
        if (nodeId < 0 || nodeId > Snowflake.MAX_NODE_ID) {
            throw new Error(`Node ID must be between 0 and ${Snowflake.MAX_NODE_ID}`);
        };
        this.nodeId = nodeId;
    }

    generate(): string {
        let timestamp = BigInt(Date.now() - Snowflake.EPOCH);
        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1n) & BigInt(Snowflake.MAX_SEQUENCE);
            if (this.sequence === 0n) {
                // Sequence overflow, wait until next millisecond
                while (timestamp <= this.lastTimestamp) {
                    timestamp = BigInt(Date.now() - Snowflake.EPOCH);
                }
            }
        } else {
            this.sequence = 0n;
        }
        this.lastTimestamp = timestamp;
        const snowflake =
            ((timestamp) << BigInt(Snowflake.NODE_ID_BITS + Snowflake.SEQUENCE_BITS)) |
            (BigInt(this.nodeId) << BigInt(Snowflake.SEQUENCE_BITS)) |
            this.sequence;
        return snowflake.toString();
    }
}

// Initialize a Snowflake object for the run-time device
const nodeId: number = generateNodeID();
export const snowflake = new Snowflake(nodeId);