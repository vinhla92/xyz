import _xyz from '../../_xyz.mjs';

export default (group, infoj) => {

  const group_infoj = infoj.filter(entry => entry.group === group);

  console.log(group_infoj);

};