import { Model, Column, Table, DataType, AllowNull, Unique, IsEmail, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import VendorProfile from './VendorProfile';

@Table({
    tableName: 'contact-person',
    timestamps: true
})
export default class ContactPerson extends Model {
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
    name!: string;

    @AllowNull(false)
    @Unique
    @IsEmail
    @Column({
        type: DataType.STRING
    })
    email!: string;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING
    })
    phoneNumber!: string;

    @ForeignKey(() => VendorProfile)
    @Column({
        type: DataType.INTEGER,
    })
    vendorProfileId!: number;

    @BelongsTo(() => VendorProfile)
    vendorProfile?: VendorProfile;
}
