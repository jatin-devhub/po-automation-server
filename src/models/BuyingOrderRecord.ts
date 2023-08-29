import { Model, Table, Column, DataType, ForeignKey, AllowNull, AutoIncrement, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import BuyingOrder from './BuyingOrder'; // Assuming you have a BuyingOrder model

@Table
class BuyingOrderRecord extends Model<BuyingOrderRecord> {
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    expectedQty!: number;
    
    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
    unitCost!: number;
  
    @Column({ allowNull: false, type: DataType.DECIMAL(5, 2) })
    gst!: number;
  
    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
    amountWithGst!: number;

    @ForeignKey(() => BuyingOrder)
    @Column({
        type: DataType.INTEGER
    })
    buyingOrderId!: number;

    @BelongsTo(() => BuyingOrder)
    buyingOrder!: BuyingOrder
}

export default BuyingOrderRecord;
