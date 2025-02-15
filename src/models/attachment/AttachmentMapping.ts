import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Attachment from "./Attachment";

@Table({
    timestamps: true,
    tableName: 'attachment_mapping'
})
export default class AttachmentMapping extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Attachment)
    @Column(DataType.INTEGER)
    attachmentId!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    attachmentType!: string; 

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    entityId!: number; 

    @BelongsTo(() => Attachment)
    attachment!: Attachment;
}
