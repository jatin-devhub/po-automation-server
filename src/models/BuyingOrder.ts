import { Model, Table, HasMany, AllowNull, AutoIncrement, PrimaryKey, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import BuyingOrderRecord from './BuyingOrderRecord';
import { Vendor } from './Vendor';

@Table
class BuyingOrder extends Model<BuyingOrder> {
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @HasMany(() => BuyingOrderRecord)
    records?: BuyingOrderRecord[];

    @ForeignKey(() => Vendor)
    @Column({
        type: DataType.INTEGER
    })
    vendorId!: number;

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}

export default BuyingOrder;
