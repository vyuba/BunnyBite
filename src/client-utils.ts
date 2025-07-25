import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

const getProfileIcon = (name: string, scale = 80, package_type = initials) => {
  const avatar = createAvatar(package_type, {
    seed: name,
    scale,
    backgroundColor: ["#303030"],
  });

  const svg = avatar.toDataUri();
  //   console.log(svg);
  return svg;
};

export { getProfileIcon };
