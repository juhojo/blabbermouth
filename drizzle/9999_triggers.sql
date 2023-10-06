CREATE TRIGGER IF NOT EXISTS passcodes_del_old_row AFTER INSERT ON passcodes
  BEGIN
    DELETE passcodes WHERE user_id = new.user_id AND id != new.id
  END;