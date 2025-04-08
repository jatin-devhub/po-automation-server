import { Model, Table, Column, DataType, ForeignKey, AllowNull, AutoIncrement, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import SKU from './sku/SKU';
import PurchaseOrder from './PurchaseOrder';

@Table({
    tableName: 'purchase_order_record'
})
export default class PurchaseOrderRecord extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    expectedQty!: number;
    
    @AllowNull(false)
    @Column({ type: DataType.DECIMAL(10, 2) })
    unitCost!: number;
  
    @AllowNull(false)
    @Column({ type: DataType.DECIMAL(5, 2) })
    gst!: number;

    @Column({ type: DataType.INTEGER })
    short!: number;

    @Column({ type: DataType.INTEGER })
    damaged!: number;

    @Column({ type: DataType.INTEGER })
    excess!: number;

    @ForeignKey(() => SKU)
    @Column({
        type: DataType.INTEGER
    })
    skuId!: number;

    @ForeignKey(() => PurchaseOrder)
    @Column({
        type: DataType.INTEGER
    })
    purchaseOrderId!: number;

    @BelongsTo(() => SKU)
    sku!: SKU

    @BelongsTo(() => PurchaseOrder)
    purchaseOrder!: PurchaseOrder
}
