import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull, AutoIncrement, PrimaryKey } from 'sequelize-typescript';
import VendorProfile from './VendorProfile';

@Table({
    tableName: 'vendor-address',
    timestamps: true,
})
export default class VendorAddress extends Model {
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

    @ForeignKey(() => VendorProfile)
    @Column({
        type: DataType.INTEGER,
    })
    vendorProfileId!: number;

    @BelongsTo(() => VendorProfile)
    vendorProfile?: VendorProfile;
}
