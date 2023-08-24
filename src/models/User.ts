import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";

@Table({
    timestamps: true,
    tableName: "user"
})

export class User extends Model {
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id!: number;

    @Column({
        type: DataType.STRING
    })
    company!: string

    @Column({
        type: DataType.STRING
    })
    gst!: string

    @Column({
        type: DataType.STRING
    })
    gstAttachment!: string

    @Column({
        type: DataType.STRING
    })
    address!: string

    @Column({
        type: DataType.STRING
    })
    !: string


    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}