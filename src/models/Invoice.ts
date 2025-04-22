import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import PurchaseOrder from "./PurchaseOrder";
import AttachmentMapping from "./attachment/AttachmentMapping";

@Table
export default class Invoice extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({
        type: DataType.STRING,
    })
    invoiceDate!: string;

    @HasOne(() => AttachmentMapping, {
        foreignKey: 'entityId',
        scope: { attachmentType: 'invoiceAttachment' }
    })
    invoiceAttachment!: AttachmentMapping;

    @ForeignKey(() => PurchaseOrder)
    @Column({
        type: DataType.INTEGER,
    })
    poId!: number;

    @BelongsTo(() => PurchaseOrder)
    po!: PurchaseOrder;
}
