import { Model, Table, HasMany, AllowNull, AutoIncrement, PrimaryKey, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import BuyingOrderRecord from './BuyingOrderRecord';
import { Vendor } from './Vendor';

@Table
class BuyingOrder extends Model {
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    currency!: string

    @Column({
        type: DataType.STRING
    })
    paymentTerms!: string

    @Column({
        type: DataType.STRING
    })
    estimatedDeliveryDate!: string

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
