import { Model, Table, Column, DataType, ForeignKey, AllowNull, AutoIncrement, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import BuyingOrder from './BuyingOrder'; // Assuming you have a BuyingOrder model
import SKU from './SKU';

@Table
export default class BuyingOrderRecord extends Model {
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

    @ForeignKey(() => SKU)
    @Column({
        type: DataType.INTEGER
    })
    skuId!: number;

    @ForeignKey(() => BuyingOrder)
    @Column({
        type: DataType.INTEGER
    })
    buyingOrderId!: number;

    @BelongsTo(() => SKU)
    sku!: SKU

    @BelongsTo(() => BuyingOrder)
    buyingOrder!: BuyingOrder
}
