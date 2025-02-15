import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Attachment from "./Attachment";

@Table({
    tableName: 'attachment_chunk',
})
export default class AttachmentChunk extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @AllowNull(false)
    @ForeignKey(() => Attachment)
    @Column({
        type: DataType.INTEGER
    })
    attachmentId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER
    })
    chunkIndex!: number;

    @AllowNull(false)
    @Column({
        type: DataType.BLOB('medium')
    })
    chunkData!: Buffer;

    @BelongsTo(() => Attachment)
    attachment!: Attachment;
}
