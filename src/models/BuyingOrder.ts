import { Model, Table, HasMany, AllowNull, AutoIncrement, PrimaryKey, Column, DataType, ForeignKey, BelongsTo, Unique, Default, HasOne } from 'sequelize-typescript';
import BuyingOrderRecord from './BuyingOrderRecord';
import Vendor from './Vendor';
import Comment from './Comment';
import File from './File';
import BOInvoices from './BOInvoices';
import BuyingOrderOther from './BuyingOrderOther';

@Table
export default class BuyingOrder extends Model {
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
    poCode!: string

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
    verificationLevel!: string

    @HasOne(() => File, { foreignKey: 'buyingOrderId'})
    poAttachment!: File;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    createdBy!: string
    
    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    closed!: boolean

    @Column({
        type: DataType.STRING
    })
    grnComment!: string

    @HasMany(() => BOInvoices)
    invoiceAtts!: BOInvoices[];

    @HasMany(() => BuyingOrderOther)
    otherFields!: BuyingOrderOther[];

    @HasOne(() => File, { foreignKey: 'buyingOrderIdPackaging' })
    packagingAtt!: File;

    @HasOne(() => File, { foreignKey: 'buyingOrderIdGRNSheet'})
    grnAtt!: File

    @HasMany(() => BuyingOrderRecord)
    records?: BuyingOrderRecord[];

    @HasMany(() => Comment)
    comments!: Comment[];

    @ForeignKey(() => Vendor)
    @Column({
        type: DataType.INTEGER
    })
    vendorId!: number;

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}
