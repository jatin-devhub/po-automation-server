import {
    Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, DataType, ForeignKey, BelongsTo, HasMany, Default, Unique
} from 'sequelize-typescript';
import Vendor from './Vendor';
import BuyingOrderRecord from './BuyingOrderRecord';
import Comment from './Comment';

@Table
export default class SKU extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING
    })
    skuCode!: string;

    @Column({ type: DataType.STRING })
    category!: string;

    @Column({ type: DataType.STRING })
    brand!: string;

    @Column({ type: DataType.STRING })
    productTitle!: string;

    @Column({ type: DataType.STRING })
    hsn!: string;

    @Column({ type: DataType.STRING })
    ean!: string;

    @Column({ type: DataType.STRING })
    modelNumber!: string;

    @Column({ type: DataType.STRING })
    size!: string;

    @Column({ type: DataType.STRING })
    colorFamilyColor!: string;

    @Column({ type: DataType.FLOAT })
    productLengthCm!: number;

    @Column({ type: DataType.FLOAT })
    productBreadthCm!: number;

    @Column({ type: DataType.FLOAT })
    productHeightCm!: number;

    @Column({ type: DataType.FLOAT })
    productWeightKg!: number;

    @Column({ type: DataType.INTEGER })
    masterCartonQty!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonLengthCm!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonBreadthCm!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonHeightCm!: number;

    @Column({ type: DataType.FLOAT })
    masterCartonWeightKg!: number;

    @Column({ type: DataType.FLOAT })
    MRP!: number;

    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isVerified!: boolean

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    createdBy!: string

    @ForeignKey(() => Vendor)
    @Column({ type: DataType.INTEGER })
    vendorId!: number;

    @BelongsTo(() => Vendor)
    vendor?: Vendor;

    @HasMany(() => BuyingOrderRecord)
    buyingRecords!: BuyingOrderRecord

    @HasMany(() => Comment)
    comments!: Comment[]
}
