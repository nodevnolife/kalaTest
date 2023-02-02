-- CreateTable
CREATE TABLE `karyawan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_karyawan` VARCHAR(50) NULL,
    `nomor_induk` VARCHAR(40) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `update_at` TIMESTAMP(0) NULL,
    `user_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `karyawan_id_key`(`id`),
    UNIQUE INDEX `karyawan_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NULL,

    UNIQUE INDEX `users_id_user_key`(`id_user`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `karyawan` ADD CONSTRAINT `karyawan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;
