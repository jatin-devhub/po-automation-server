import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import Vendor from './Vendor';

@Table({
    tableName: 'vendor-address',
    timestamps: true,
})
export default class VendorAddress extends Model {
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
    addressLine1!: string;

    @Column({
        type: DataType.STRING
    })
    addressLine2!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    country!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    state!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    city!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    postalCode!: string;

    @ForeignKey(() => Vendor)
    @Column({
        type: DataType.INTEGER,
    })
    vendorId!: number;

    @BelongsTo(() => Vendor)
    vendor?: Vendor;
}
