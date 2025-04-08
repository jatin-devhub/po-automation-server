import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import PurchaseOrder from "./PurchaseOrder";

@Table
export default class Invoice extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @ForeignKey(() => PurchaseOrder)
    @Column({
        type: DataType.INTEGER,
    })
    poId!: number;

    @BelongsTo(() => PurchaseOrder)
    po!: PurchaseOrder;
}
